import { combineReducers } from '@reduxjs/toolkit';
import reviewsReducer from './reviews';  // Assuming you have a file at ./reviews
import spotsReducer from './spots';      // Assuming you have a file at ./spots
import sessionReducer from './session';  // Assuming you have a file at ./session

// Combine all reducers here
const rootReducer = combineReducers({
  reviews: reviewsReducer,
  spots: spotsReducer,
  session: sessionReducer,
});

export default rootReducer;

