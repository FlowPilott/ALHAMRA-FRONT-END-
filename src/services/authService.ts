
// src/services/authService.ts
import axios from 'axios';
import { isAdmin } from '../api/modules/Swiftsync.class';
import { setAdminStatus } from '../redux/slices/isAdminSlice';
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const AuthService = {
  verifyCode: async (payload: payload) => {
    try {
      const response = await axios.post(`${BASE_URL}user/verify/code/`, payload);
      return response;
    } catch (error) {
      throw error;
    }
  },

  refreshToken: async (refreshToken: string) => {
    try {
      const response = await axios.post(`${BASE_URL}user/token/refresh/`, { refreshToken });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
 
};
// export const isAdminfetchAdminStatus = () => {
//   return async (dispatch: any) => { 
//     try {
//       const response = await isAdmin(); 
//       dispatch(setAdminStatus(response));
//     } catch (error) {
     
//       console.error('Error fetching admin status:', error);
//     }
//   };
// };