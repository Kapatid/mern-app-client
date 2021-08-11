import { TailSpin  } from 'react-loading-icons'
import { ImSad2 } from 'react-icons/im';

import { useAppSelector } from '../../app/hooks';
import Post from './Post/Post';
import { IPost } from '../../features/posts/postsSlice';
import PostsStatus from '../../enums/postsStatus';

const Posts = () => {
  const posts: IPost[] = useAppSelector(state => state.posts.posts);
  const postsStatus: PostsStatus = useAppSelector(state => state.posts.status);

  const loadingStyles = {
    placeSelf: 'center', 
    marginLeft: '200px', 
    height: '80px',
    width: '80px'
  }

  const statusStyles = {
    display: 'flex', 
    placeSelf: 'center', 
    marginLeft: '200px', 
    alignItems: 'center',
    height: '80px',
    width: 'max-content'
  }

  return (
    <>
      {
        (postsStatus === PostsStatus.LOADING) ? 
        <TailSpin 
          style={loadingStyles} 
          stroke='#61dafb'
          fill='#61dafb'
          speed={.75} 
        /> :

        (posts.length > 0) ? (posts.map(( post, index ) => (
          <Post key={index} post={post} /> 
        ))) :

        (postsStatus  === PostsStatus.FAILED) ?
        <h3 style={statusStyles}>
          Unable to get posts &nbsp;
          <ImSad2 stroke='#61dafb' fill='#61dafb' />
        </h3> :

        (postsStatus  === PostsStatus.EMPTY) && 
        <h3 style={statusStyles}>No memories... <br /> Create one now!</h3>
      }
    </>
  );
};

export default Posts;
