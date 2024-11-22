// frontend/src/store/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import someSlice from './someSlice';

const rootReducer = combineReducers({
  some: someSlice, // Add your slices here
});

export default rootReducer;
