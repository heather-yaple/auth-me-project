import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import spotsReducer from './spots';
import reviewsReducer from './reviews';
// You might add other reducers in the future, so you can extend this easily
// import usersReducer from './users'; 
import logger from 'redux-logger';

/**
 * Combine all reducers into a rootReducer.
 * As your application grows, more reducers can be added here easily.
 */
const rootReducer = combineReducers({
  session: sessionReducer,
  spots: spotsReducer,
  reviews: reviewsReducer,
  // users: usersReducer, // Uncomment this if you introduce a users reducer later
});

/**
 * Configure store enhancer.
 * In production, only apply middleware (like thunk) to avoid exposing Redux DevTools.
 * In development, enable Redux DevTools Extension along with logging middleware.
 */
let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger)); // Add logger middleware for debugging
}

/**
 * The configureStore function sets up the Redux store.
 * You can pass in preloadedState if needed, such as when you're hydrating the store with data.
 */
const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
