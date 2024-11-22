// frontend/src/store/someSlice.js
import { createSlice } from '@reduxjs/toolkit';

const someSlice = createSlice({
  name: 'some',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { increment, decrement, setValue } = someSlice.actions;
export default someSlice.reducer;
