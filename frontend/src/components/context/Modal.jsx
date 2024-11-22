// src/components/context/Modal.jsx

import React, { useState, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import './Modal.css';

const ModalContext = React.createContext();

export function ModalProvider({ children }) {
  const [modalContent, setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);

  const closeModal = () => {
    setModalContent(null);
    if (typeof onModalClose === 'function') {
      setOnModalClose(null);
      onModalClose();
    }
  };

  const contextValue = {
    modalContent,
    setModalContent,
    setOnModalClose,
    closeModal,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
}

export function Modal() {
  const { modalContent, closeModal } = useContext(ModalContext);
  if (!modalContent) return null;

  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={closeModal} />
      <div id="modal-content">{modalContent}</div>
    </div>,
    document.body
  );
}

export const useModal = () => useContext(ModalContext);