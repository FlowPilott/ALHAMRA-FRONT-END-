// isAdminSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminState {
  isAdmin: boolean;
}

const initialState: AdminState = {
  isAdmin: false,
};

const isAdminSlice = createSlice({
  name: 'isAdmin',
  initialState,
  reducers: {
    setAdminStatus: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload;
    },
  },
});

export const { setAdminStatus } = isAdminSlice.actions;
export default isAdminSlice.reducer;
