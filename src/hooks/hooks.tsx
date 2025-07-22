import { useDispatch } from 'react-redux';
import type { AppDispatch } from './AppDispatch';

// Use throughout your app instead of `useDispatch`
export const useAppDispatch: () => AppDispatch = useDispatch;
