import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
// Import as named import from redux-thunk
import thunk from 'redux-thunk';


const rootReducer = combineReducers({
  // Add your reducers here
});

let enhancer;
if (import.meta.env.MODE === 'production') {
  // Production mode uses only thunk middleware
  enhancer = applyMiddleware(thunk);
} else {
  // Development mode uses thunk and logger middleware
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

/**
 * Configure and create the Redux store.
 * @param {Object} [preloadedState] - Optional initial state of the store.
 * @returns {Store} The configured store.
 */
const configureStore = (preloadedState = {}) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
