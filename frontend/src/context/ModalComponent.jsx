// frontend/src/context/ModalComponent.jsx
import { useContext } from 'react';
import ReactDOM from 'react-dom';
import { ModalContext } from './Modal';

export function Modal() {
    const { modalRef, modalContent, closeModal } = useContext(ModalContext);
    if (!modalRef.current || !modalContent) return null; // Render nothing if no content

    return ReactDOM.createPortal(
        <div id="modal">
            <div id="modal-background" onClick={closeModal} />
            <div id="modal-content">{modalContent}</div>
        </div>,
        modalRef.current // Render the modal into the modalRef's DOM node
    );
}
