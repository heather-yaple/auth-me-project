import React, { useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

// Create a Context for the Modal
const ModalContext = React.createContext();

// ModalProvider Component to Wrap Your App
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
      <Modal />
    </ModalContext.Provider>
  );
}

// Modal Component to Render the Modal
export function Modal() {
  const { modalContent, closeModal } = useContext(ModalContext);

  if (!modalContent) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        {modalContent}
      </div>
    </div>,
    document.body
  );
}

// Hook to Use Modal Context
export const useModal = () => useContext(ModalContext);
