// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import isAdminSlice from './slices/isAdminSlice';
import thunk from 'redux-thunk'; // Import Redux Thunk
import titleSlice from './slices/titleSlice';
import tasksReducer from './slices/taskSlice'; // Import your tasks slice

const store = configureStore({
  reducer: {
    title: titleSlice,
    auth: authReducer,
    isAdmin: isAdminSlice,
    tasks: tasksReducer,

  },
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
