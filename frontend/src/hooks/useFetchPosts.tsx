import { useSetRecoilState } from 'recoil';
import { postsLoadingState, postState } from '../utils/atoms';
import axios from 'axios';
import { useCallback } from 'react';

export const useFetchPosts = () => {
  const setPosts = useSetRecoilState(postState);
  const setLoading = useSetRecoilState(postsLoadingState);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`);
      console.log(response.data.posts);
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  },[setLoading, setPosts]);

  return { fetchPosts };
};