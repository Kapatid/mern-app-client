import { createSlice } from "@reduxjs/toolkit";

import * as api from '../../api/API';
import PostsStatus from "../../enums/postsStatus";
// import { RootState } from "../../app/store";

export interface IPost {
  _id?: string;
  createdAt?: Date;
  title: string;
  message: string;
  creator: string;
  tags: string[];
  selectedFile: string;
  likes?: string[];
}

export interface PostState {
  posts: any[];
  formPost: IPost | null;
  updatedPost?: IPost;
  status: PostsStatus,  
  error: string | null
}

const initialState: PostState = {
  posts: [],
  formPost: null,
  status: PostsStatus.IDLE,
  error: null
};

const logError = (error: any) => {
  console.log('%c[ERROR]%c' + error.message, 'color: red');
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPostsStatus: ( state, action ) => {
      state.status = action.payload;
    },
    setPosts: ( state, action ) => {      
      (action.payload.length === 0) ?
        state.status = PostsStatus.EMPTY :
        state.status = PostsStatus.IDLE;    
      
      state.posts = action.payload;
    },
    addPost: ( state, action ) => {
      state.posts.push(action.payload);
    },
    setFormPost: ( state, action ) => {
      (action.payload !== null) && (state.updatedPost = action.payload);
      state.formPost = action.payload;
    },
  }
})

export const { 
  setPostsStatus,
  setPosts,
  addPost,
  setFormPost,
} = postsSlice.actions;

// export const selectPosts = (state: RootState) => state.posts.posts;

// export const instanceOfIPost = (data: any): data is IPost => {
//   return data;
// }

export const getPosts = () => async (dispatch: any) => {  
  try {
    dispatch(setPostsStatus(PostsStatus.LOADING));

    const response = await api.fetchPosts();  

    dispatch(setPosts(response.data));
    dispatch(setPostsStatus(PostsStatus.SUCCEEDED));
  } catch (error: any) {
    (error.message === 'Request aborted') 
      ? console.log('%c[ATTENTION]%c' + error.message, 'color: yellow') 
      : logError(error);

    dispatch(setPostsStatus(PostsStatus.FAILED));
  }
}

export const createPost = (post: IPost) => async (dispatch: any) => {
  try {
    dispatch(setPostsStatus(PostsStatus.CREATING));

    await api.createPost(post);

    dispatch(addPost(post));
    dispatch(setPostsStatus(PostsStatus.SUCCEEDED));
  } catch (error) {
    logError(error);
    dispatch(setPostsStatus(PostsStatus.FAILED));
  }
}

export const updateFormPost = (post: IPost | null) => (dispatch: any) => {
  dispatch(setFormPost(post));
}

export const updatePost = (post: IPost) => async (dispatch: any) => {
  try {
    await api.updatePost(post);
    
    dispatch(setFormPost(null));
    dispatch(setPostsStatus(PostsStatus.SUCCEEDED));
  } catch (error) {
    logError(error);
    dispatch(setPostsStatus(PostsStatus.FAILED));
  }
}

export const likePost = (
  post: IPost, 
  userId: string,
  callback: ((post: IPost) => void)) => 
  (dispatch: any) => {

  let newLikes: string[] = post.likes!.map(id => id);
  
  const idString = newLikes!.findIndex(id => id === userId);

  (idString === -1) 
    ? newLikes!.push(userId)
    : newLikes = newLikes!.filter(id => id !== userId);

  dispatch(updatePost({ ...post, likes: newLikes}));
  callback({ ...post, likes: newLikes});
}

export const deletePost = (post: IPost) => async (dispatch: any) => {
  try {
    await api.deletePost(post);
  } catch (error) {
    logError(error);
    dispatch(setPostsStatus(PostsStatus.FAILED));
  }
}

export default postsSlice.reducer;