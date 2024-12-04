import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './session';
import spotsReducer from './spots';
import reviewsReducer from './reviews';

// Configure the store using Redux Toolkit
const store = configureStore({
  reducer: {
    session: sessionReducer,
    spots: spotsReducer,
    reviews: reviewsReducer,
  },
  // Redux Toolkit automatically adds thunk and supports Redux DevTools by default
});

export default store;

