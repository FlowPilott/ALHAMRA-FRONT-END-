// features/tasks/tasksSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTask } from '../../api/modules/Swiftsync.class';

const userId = localStorage?.getItem('user-id') || '';

export const fetchActiveTasksCount = createAsyncThunk(
  'tasks/fetchActiveTasksCount',
  async () => {
    const res = await getTask(userId);
    const activeCount = res?.data?.filter((task: any) => task.status === 'In Progress').length || 0;
    return activeCount;
  }
);

interface TasksState {
  count: number;
  loading: boolean;
}

const initialState: TasksState = {
  count: 0,
  loading: false,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveTasksCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActiveTasksCount.fulfilled, (state, action) => {
        state.count = action.payload;
        state.loading = false;
      });
  },
});

export default tasksSlice.reducer;
export const selectActiveCount = (state: { tasks: TasksState }) => state.tasks.count;