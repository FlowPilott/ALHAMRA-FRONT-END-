// hooks/useRefreshTaskCount.ts
import { useDispatch } from 'react-redux';
import { fetchActiveTasksCount } from '../redux/slices/taskSlice';

export const useRefreshTaskCount = () => {
  const dispatch = useDispatch();
  
  // Call this after ANY successful API operation
  const refresh = () => {
    dispatch(fetchActiveTasksCount());
  };

  return refresh;
};