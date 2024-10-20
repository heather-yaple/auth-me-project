//frontend/src/main.jsx


import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import configureStore from './store'; 
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session';
import { ModalProvider, Modal } from './components/context/Modal';

const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  restoreCSRF();
  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Modal /> 
        </BrowserRouter>
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);