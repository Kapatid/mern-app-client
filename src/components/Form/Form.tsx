import { FormEvent, useEffect, useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { createPost, IPost, updateFormPost, updatePost } from '../../features/posts/postsSlice';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import './styles.css';
import { IUser } from '../../features/users/userSlice';
import PostsStatus from '../../enums/postsStatus';
import { TailSpin } from 'react-loading-icons';

const Form = () => {
  const dispatch = useAppDispatch();

  const post: IPost | null = useAppSelector(state => state.posts.formPost);
  const postsStatus: PostsStatus = useAppSelector(state => state.posts.status);
  const user: IUser | null = useAppSelector(state => state.user.user);

  const emptyPost ={
    title: '',
    message: '',
    creator: user?.firstName!,
    tags: [],
    selectedFile: '',
    likes: []
  };
  const [postData, setPostData] = useState<IPost>(emptyPost);
  const [images, setImages] = useState<ImageListType>([]);

  useEffect(() => {
    if (post !== null) setPostData(post!);
  }, [post]);

  const onChangeImg = (
    imageList: ImageListType,
    // addUpdateIndex: number[] | undefined
  ) => {
    setImages(imageList as never[]);
    setPostData({ ...postData, selectedFile: imageList.slice(0, 1).pop()?.dataURL! });
  };

  const clear = () => {
    setPostData(emptyPost);
    setImages([]);
    dispatch(updateFormPost(null));
  }

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (post !== null) {
      dispatch(updateFormPost(postData));
      dispatch(updatePost(postData));
    }
    else dispatch(createPost(postData));

    clear();
  }

  return (
    <>
      {
        user !== null
          ? <form 
              className='form'
              autoComplete='off' 
              noValidate 
              onSubmit={(e) => {submitForm(e)}}
            >
              <h2>
                {
                  (post === null) ? 'Create a memory...' :
                  `Update memory by ${post!.creator}`
                }
              </h2>
              <section>
                <input 
                  type='text' 
                  id='title' 
                  name='title'
                  value={postData.title}
                  onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                  placeholder=''
                />
                <label htmlFor='title'>Title</label>
              </section>
              <section>
                <input 
                  type='text' 
                  id='message' 
                  name='message'
                  value={postData.message}
                  onChange={(e) => setPostData({ ...postData, message: e.target.value })}
                  placeholder=''
                />
                <label htmlFor='message'>Message</label>
              </section>
              <section>
                <input 
                  type="text" 
                  id='tags' 
                  name='tags'
                  value={postData.tags}
                  onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })}
                  placeholder=''
                />
                <label htmlFor='tags'>Tags (tag1,tag2)</label>
              </section>
              <section>
                <label htmlFor='img-upload'>Upload Image</label>
                <ImageUploading
                  multiple
                  value={images}
                  onChange={onChangeImg}
                  maxNumber={1}
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps
                    }) => (
                      // write your building UI
                      <div className="upload__image-wrapper">
                      {images.length < 1  
                        ? <input
                            type='button' 
                            value='Click or Drop here'
                            style={isDragging ? { color: "red" } : undefined}
                            onClick={onImageUpload}
                            {...dragProps}
                          />
                        : imageList.map((image, index) => (
                            <div key={index} className="image-item">
                              <img src={image.dataURL} alt="" width="100" />
                              <div className="image-item__btn-wrapper">
                                <input type='button' value='Update' onClick={() => onImageUpdate(index)}/>
                                <input type='button' value='Remove' onClick={() => onImageRemove(index)}/>
                              </div>
                            </div>
                          ))
                      }
                      </div>
                    )
                  }
                </ImageUploading>
              </section>
              <section>
                <button type='submit'>Submit</button>
                <button type='reset' onClick={clear}>Clear</button>
              </section>

              {
                (postsStatus === PostsStatus.CREATING) 
                  && <TailSpin 
                      stroke='#61dafb'
                      fill='#61dafb'
                      style={{ placeSelf: 'center' }}
                      speed={.75} 
                    /> 
              }
            </form>
          : <div className='form-off'>
              Please log in first before posting anything.
            </div>
      }
      
    </>
  );
};

export default Form;
