import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
     const authToken = localStorage.getItem('access');
    
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export default axiosInstance;
