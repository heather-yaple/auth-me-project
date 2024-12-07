import { combineReducers } from '@reduxjs/toolkit';
import reviewsReducer from './reviews';  // Assuming you have a file at ./reviews
import cabinsReducer from './cabins';      // Assuming you have a file at ./cabins
import sessionReducer from './session';  // Assuming you have a file at ./session

// Combine all reducers here
const rootReducer = combineReducers({
  reviews: reviewsReducer,
  cabins: cabinsReducer,
  session: sessionReducer,
});

export default rootReducer;

