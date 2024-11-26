import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session'; 
import { ModalProvider } from './context/Modal';

// Set up CSRF protection and initialize global store and session actions if not in production
if (import.meta.env.MODE !== "production") {
  restoreCSRF();
  
  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

// Create and render the root component, wrapping it with Redux Provider and ModalProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>  {/* Providing the store to all child components */}
      <ModalProvider>           {/* Providing modal context to manage modals globally */}
        <App />                 {/* The main application component */}
      </ModalProvider>
    </Provider>
  </React.StrictMode>
);
