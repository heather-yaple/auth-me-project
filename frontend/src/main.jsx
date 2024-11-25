// frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session'; 
import { Modal, ModalProvider } from './context/Modal';

// const store = configureStore();

if (import.meta.env.MODE !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions; 
  window.Modal = Modal;
  window.ModalProvider = ModalProvider;
}


// if (import.meta.env.MODE !== 'production') {
//   restoreCSRF();

//   window.csrfFetch = csrfFetch;
//   window.store = store;
// }

// if (process.env.NODE_ENV !== 'production') {
//   window.store = store;
// }

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
  <Provider store={store}>              
    <ModalProvider>
      <App />
    </ModalProvider>
  </Provider>
  </React.StrictMode>
);
