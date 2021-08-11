import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { getPosts } from './features/posts/postsSlice';
import { useEffect } from 'react';

import './App.css';
import { useAppDispatch, useAppSelector } from './app/hooks';
import Auth from './components/Auth/Auth';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import { IUser } from './features/users/userSlice';

const App = () => {
  const user : IUser | null = useAppSelector(state => state.user.user); 
  const dispatch = useAppDispatch();
  
  useEffect(() => {    
    dispatch(getPosts());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <BrowserRouter>
      <div className='app'>
        <Navbar />

        <Switch>
          <Route path='/' exact component={Home}/>
          <Route path='/auth' exact component={Auth}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
