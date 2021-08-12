import { FC, useEffect, useState } from 'react';
import moment from 'moment';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { AiFillLike, AiOutlineLike, AiFillDelete } from 'react-icons/ai';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { IPost, updateFormPost, deletePost, likePost } from '../../../features/posts/postsSlice';
import './styles.css';
import { IUser } from '../../../features/users/userSlice';

const Post: FC<{
  post: IPost;
}> = ({ post }) => {
  const dispatch = useAppDispatch();

  const user : IUser | null = useAppSelector(state => state.user.user);
  const formPost: IPost | undefined = useAppSelector(state => state.posts.updatedPost);
  const [postState, setPostState] = useState<IPost | null>(post);
  const passPostToFrom = (post: IPost) => dispatch(updateFormPost(post));
  
  const [userLiked, setUserLiked] = useState(() => {
    const userId = user?._id || user?.googleId;
    if (postState!.likes!.findIndex(id => id === userId) >= 0) {
      return true;
    } else {
      return false;
    }
  });

  useEffect(() => {
    // Update client-side post when the user updates a post
    if (formPost !== undefined && formPost._id === postState?._id) setPostState(formPost!);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formPost]);

  const handleLike = () => {
    const userId = user?._id || user?.googleId;

    dispatch(likePost(postState!, userId!, 
      (newPost) => {
        setPostState(newPost);
      }
    ));

    setUserLiked(!userLiked);
  }

  const handleDelete = async () => {
    await dispatch(deletePost(post));
    setPostState(null);
  }

  return (
    <>
      {
        (postState !== null) &&
        (
          <div 
            className='post' 
          >
            <header className='post-header'>
              <div className='img-header'>
                <div>
                  <h3 className='header-creator'>{postState!.creator}</h3>
                  <p className='header-createdAt'>{moment(postState!.createdAt).fromNow()}</p>
                </div>
                {
                  user && post.creator === user.firstName
                    && <BiDotsHorizontalRounded 
                        title='Edit'
                        className='header-dots'
                        onClick={() => {passPostToFrom(postState!)}}
                        style={{
                          cursor: 'pointer',
                          height: '30px',
                          width: '30px'
                        }}
                      />
                }
              </div>
              <img src={postState!.selectedFile} alt='img' />
            </header>

            <div className='post-body'>
              <div>{postState!.tags.map((tag) => ` #${tag}`)}</div>
              <h2>{postState!.title}</h2>
              <p>{postState!.message}</p>
            </div>
            
            <footer className='post-footer'>
              <button onClick={() => user && handleLike()}>
                
                {
                  userLiked === true 
                    ? <AiFillLike 
                        fill='#61dafb' 
                        stroke='#61dafb' 
                      />
                    : <AiOutlineLike 
                        fill='#61dafb' 
                        stroke='#61dafb' 
                      />
                }
                &nbsp;
                {
                  (postState!.likes!.length === 0) 
                    ? ` LIKE`
                    : (postState!.likes!.length === 1) ? (` ${postState!.likes!.length} LIKE`)
                    : (postState!.likes!.length > 1) && (` ${postState!.likes!.length} LIKES`)
                }
              </button>

              {
                user && post.creator === user.firstName
                  && <button onClick={handleDelete}>
                      <AiFillDelete 
                        fill='#61dafb' 
                        stroke='#61dafb' 
                      />
                      &nbsp;DELETE
                    </button>
              }
            </footer>
          </div>
        )
      }
    </>
  );
}

export default Post
