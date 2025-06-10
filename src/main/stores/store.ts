import { configureStore } from '@reduxjs/toolkit';
import motion from './slices/motionSlice';

export const store = configureStore({
  reducer: {
    motion: motion,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
