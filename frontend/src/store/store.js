import { configureStore } from '@reduxjs/toolkit';
// import { csrfFetch } from './csrf';
import usersReducer from './users.js';
import errorReducer from './errorSlice.js';  // Assuming you've added this
import thunk from 'redux-thunk';
import cabinsReducer from './cabins.js';
import reviewsReducer from './reviews.js';
import authSlice from './auth.js';
import rootReducer from './rootReducer.js';
import sessionReducer from './session.js';

// Adding thunk to the middleware stack
export const store = configureStore({
  reducer: {
    users: usersReducer,
    error: errorReducer,
    cabins: cabinsReducer,
    reviews: reviewsReducer,
    auth: authSlice,
    root: rootReducer,
    session: sessionReducer


    // Add other reducers here

  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: import.meta.env.MODE !== 'production',  // Ensures DevTools are only enabled in development
});

export default store;

