// frontend/src/context/Modal.jsx
import { useRef, useState, createContext } from 'react';

const ModalContext = createContext();
export function ModalProvider({ children }) {
    const contextValue = {
        modalRef,
        modalContent,
        setModalContent,
        setOnModalClose,
        closeModal,
      };
      
    const modalRef = useRef();
    const [modalContent, setModalContent] = useState(null);
    const [onModalClose, setOnModalClose] = useState(null);
    const closeModal = () => {
        setModalContent(null); // Clear the modal contents
        if (typeof onModalClose === "function") {
          onModalClose(); // Call the close callback if it exists
          setOnModalClose(null); // Reset the callback
        }
      };

      return (
        <>
          <ModalContext.Provider value={contextValue}>
            {children}
          </ModalContext.Provider>
          <div ref={modalRef} />
        </>
      );
}
