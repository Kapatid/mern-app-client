import { ChangeEvent, FormEvent, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import GoogleLogin from 'react-google-login';
import { useAppDispatch } from '../../app/hooks';

import { googleLogin, IUser, login, signup } from '../../features/users/userSlice';
import Input from './Input';
import './styles.css';
import { useHistory } from 'react-router-dom';

const Auth = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [isSignup, setIsSignup] = useState(false);
  // const [confirmPass, setConfirmPass] = useState('');

  const [formData, setFormData] = useState<IUser>({} as IUser);
  
  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    (!isSignup)
      ? dispatch(login(formData, history))
      : dispatch(signup(formData, history));
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value});
  }

  const googleSuccess = async (res: any) => {
    console.log('%cSUCCESS%c Google login success', 'color: green');
    const result = res.profileObj;
    const token = res.tokenId;
    
    try {
      dispatch(googleLogin(result, token));
      history.push('/');
    } catch (error) {
      console.log(`%cERROR%c ${error}`, 'color: red');
    }
  };
  const googleFailure = (error: any) => {
    console.log(`%cERROR%c ${error}`, 'color: red');
  };

  return (
    <form className='auth-form' onSubmit={(e) => {submitForm(e)}}>
      {
        isSignup
          // SIGN UP INPUTS
          ? <>
              <Input
                type='text' 
                id='signup-first-name' 
                name='firstName'
                onChange={(e) => {handleInput(e)}}
                placeholder=''
                label='First Name'
                htmlFor='signup-first-name'
              />
              <Input
                type='text' 
                id='signup-last-name' 
                name='lastName'
                onChange={(e) => {handleInput(e)}}
                placeholder=''
                label='Last Name'
                htmlFor='signup-last-name'
              />
              <Input
                type='email' 
                id='signup-email' 
                name='email'
                onChange={(e) => {handleInput(e)}}
                placeholder=''
                label='Email'
                htmlFor='signup-email'
              />
              <Input
                type='password' 
                id='signup-password' 
                name='password'
                onChange={(e) => {handleInput(e)}}
                placeholder=''
                label='Password'
                htmlFor='signup-password'
              />
              <Input
                type='password' 
                id='signup-confirm-password' 
                name='confirmPassword'
                onChange={(e) => {handleInput(e)}}
                placeholder=''
                label='Confirm Password'
                htmlFor='signup-confirm-password'
              />
              <section>
                <button type='submit'>Sign Up</button>
              </section>
            </>
          // LOG IN INPUTS
          : <>
              <Input
                type='email' 
                id='login-email' 
                name='email'
                onChange={(e) => {handleInput(e)}}
                placeholder=''
                label='Email'
                htmlFor='login-email'
              />
              <Input
                type='password' 
                id='login-password' 
                name='password'
                onChange={(e) => {handleInput(e)}}
                placeholder=''
                label='Password'
                htmlFor='login-password'
              />
              <section>
                <button type='submit'>Login</button>
                <GoogleLogin 
                  clientId='296578787169-mlrqhjufvuc6s5lmtg374qqbjikbsa33.apps.googleusercontent.com' 
                  render={(renderProps) => (
                    <button 
                      className='google' 
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <FcGoogle style={{ width: '20px', height: '20px'}} />
                      &nbsp;
                      Google Login
                    </button>
                  )}
                  onSuccess={googleSuccess}
                  onFailure={googleFailure}
                  cookiePolicy='single_host_origin'
                />
              </section>
            </>
      }

      {
        isSignup
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          ? <a onClick={() => {setIsSignup(false); setFormData({} as IUser)}} style={{ cursor: 'pointer' }}>
              Already have an account?
            </a>
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          : <a onClick={() => {setIsSignup(true); setFormData({} as IUser)}} style={{ cursor: 'pointer' }}>
              Need an account?
            </a>
      }
    </form>
  )
}

export default Auth
