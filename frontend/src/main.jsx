import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import configureStore from './store/store';
import * as sessionActions from './store/session';
import { restoreCSRF, csrfFetch } from './store/csrf';
import { ModalProvider } from './context/Modal';

// Function to start the app
async function startApp() {
  // Configure the Redux store asynchronously
  const store = await configureStore();

  // Attach the store to the window for development
  if (import.meta.env.NODE_ENV !== 'production') {
    window.store = store;
    window.sessionActions = sessionActions;
  }

  if (import.meta.env.MODE !== 'production') {
    restoreCSRF();
    window.csrfFetch = csrfFetch; // Make csrfFetch available globally
  }

  // Render the app
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ModalProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </ModalProvider>
    </React.StrictMode>
  );
}

// Call the function to start the app
startApp();
