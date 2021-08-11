import { Link, useHistory, useLocation } from 'react-router-dom';

import './styles.css';
import memories from '../../images/memories.png';
import { useEffect, useState } from 'react';
import { IUser, logoutUser } from '../../features/users/userSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import decode from 'jwt-decode';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const userFromLocal: IUser | null = useAppSelector(state => state.user.user);

  const [user, setUser] = useState<IUser | null>(userFromLocal);
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    setUser(userFromLocal);

    const token = user?.token;
    if (token) {
      const decodedToken: any = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) {
        dispatch(logoutUser);
        history.push('/auth');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFromLocal, location]);

  return (
    <header className='app-header'>
      <div>
        <h1>MEMORIES</h1>
        <img id='img-memories' src={memories} alt='memories.png' />
      </div>
      <div>
        <Link to="/">HOME</Link>
        {
          user !== null
            ? <>
                {
                  user.imageUrl 
                    ? <img src={user.imageUrl} alt={user.firstName + '.png'} id='avatar' />
                    : <div id='avatar-letter'>{user.firstName?.charAt(0).toUpperCase()}</div>
                }
                <div>{user.firstName}</div>
                <button 
                  id='btn-logout' 
                  onClick={() => { dispatch(logoutUser); history.push('/') }}>
                  LOGOUT
                </button>
              </>
            : <>
                <Link to="/auth">LOG IN</Link>
              </>
        }
      </div>
    </header> 
  )
}

export default Navbar
