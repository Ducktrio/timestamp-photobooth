import { createSlice } from '@reduxjs/toolkit';

interface MotionState {
  index: number;
}

const initialState: MotionState = {
  index: 0,
};

const motionSlice = createSlice({
  name: 'motion',
  initialState,
  reducers: {
    increment(state) {
      state.index++;
    },
    reset(state, action) {
      state = initialState;
    },
  },
});

export const { increment, reset } = motionSlice.actions;

export default motionSlice.reducer;
