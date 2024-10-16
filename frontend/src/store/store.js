import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import sessionReducer from './session';
import spotsReducer from './spots'; // Import spots reducer
import reviewsReducer from './reviews'; // Import reviews reducer

const rootReducer = combineReducers({
  session: sessionReducer,
  spots: spotsReducer,    // Add spots reducer
  reviews: reviewsReducer // Add reviews reducer
});

async function getEnhancer() {
  let enhancer;
  const { default: thunk } = await import('redux-thunk');

  if (import.meta.env.MODE === 'production') {
    enhancer = applyMiddleware(thunk);
  } else {
    const { default: logger } = await import('redux-logger');
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
  }

  return enhancer;
}

export async function configureStore(preloadedState = {}) {
  const enhancer = await getEnhancer();
  return createStore(rootReducer, preloadedState, enhancer);
}

export default configureStore;
