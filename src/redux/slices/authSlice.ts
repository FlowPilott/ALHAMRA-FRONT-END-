// src/redux/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  access: string | null;
  refresh: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  access: null,
  refresh: null,
  
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ access: string, refresh: string }>) => {
      state.isAuthenticated = true;
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.access = null;
      state.refresh = null;
    },
    
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
