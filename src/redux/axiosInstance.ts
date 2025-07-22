// axiosInstance.ts
import axios from 'axios';
import  {refreshToken}  from '../redux/slices/authSlice';

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Token is expired; refresh it.
      const newToken = await refreshToken();
      // Update the token in your Redux store or wherever you are storing it.
      // For example, if you are using Redux Toolkit:
      // dispatch(updateTokenAction(newToken));
      // Retry the original request with the new token.
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(error.config);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
