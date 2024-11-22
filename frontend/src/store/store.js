// frontend/src/store/store.js

// import { configureStore } from '@reduxjs/toolkit';
// import rootReducer from './rootReducer'; // Assume you will create this file for your combined reducers
// import counterReducer from './counter';
// import thunk from 'redux-thunk/es';


// const store = configureStore({
//   reducer: rootReducer,
//   counter: counterReducer,
//   devTools: import.meta.env.MODE !== 'production',
//   middleware: (getDefaultMiddleware) => {
//     if (import.meta.env.MODE === 'production') {
//       return getDefaultMiddleware();
//     } else {
//       const logger = require('redux-logger').default;
//       return getDefaultMiddleware().concat(logger);
//     }
//   },
// });

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true, // Enable thunk middleware
    }),
});


export default store;
