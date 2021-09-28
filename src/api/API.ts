import axios from "axios";
import { IPost } from "../features/posts/postsSlice";
import { IUser } from "../features/users/userSlice";

const API = axios.create({ baseURL: 'https://mern-mem-app.herokuapp.com' });

API.interceptors.request.use((req: any) => {
  if (localStorage.getItem('user')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('user')!).token}`;
  }

  return req;
});

export const fetchPosts = () => API.get('/posts');

export const createPost = (newPost: IPost) => API.post('/posts', newPost);

export const updatePost = (post: IPost) => API.patch(`/posts/${post._id}`, post);

export const deletePost = (post: IPost) => API.delete(`/posts/${post._id}`);

export const loginUser = (formData: IUser) => API.post(`/user/login`, formData);

export const signupUser = (formData: IUser) => API.post(`/user/signup`, formData);