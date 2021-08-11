import { createSlice } from "@reduxjs/toolkit";
import UsersStatus from "../../enums/usersStatus";
import * as api from '../../api/API';

export interface IUser {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  googleId?: string;
  imageUrl?: string;
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserState {
  user: IUser | null;
  status: UsersStatus;  
}

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem('user')!),
  status: UsersStatus.IDLE
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: ( state, action ) => {
      state.status = UsersStatus.AUTH;
      localStorage.setItem('user', JSON.stringify(action.payload));
      state.user = JSON.parse(localStorage.getItem('user')!);
    },
    removeUser: ( state ) => {
      state.status = UsersStatus.LOGOUT;
      localStorage.removeItem('user');
      state.user = null;
    }
  }
})

export const { 
  setUser,
  removeUser
} = userSlice.actions;

export const googleLogin = (profileObj: any, tokenId: any) => async (dispatch: any) => {  
  const newUser: IUser = { 
    ...profileObj, 
    token: tokenId,
    firstName: profileObj.givenName, 
    lastName: profileObj.familyName,
    googleId: profileObj.googleId
  } 
  
  dispatch(setUser(newUser));
}

export const login = (formData: IUser, history: any) => async (dispatch: any) => {
  try {
    const data: any = await api.loginUser(formData);
    console.log(data);
    
    dispatch(setUser({ ...data.data.user, token: data.data.token }));
    history.push('/');
  } catch (error) {
    console.log('%cERROR%c' + error.message, 'color: red');
  }
}

export const signup = (formData: IUser, history: any) => async (dispatch: any) => {
  try {
    const data: any = await api.signupUser(formData);
    
    dispatch(setUser({ ...data.data.user, token: data.data.token }));
    history.push('/');
  } catch (error) {
    console.log('%cERROR%c' + error.message, 'color: red');
  }
}

export const logoutUser = (dispatch: any) => {  
  dispatch(removeUser());
}

export default userSlice.reducer;