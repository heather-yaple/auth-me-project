// In some component like ButtonComponent.jsx
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useModal } from '../context/Modal'; // Import the custom hook

function ButtonComponent() {
    const { setModalContent, setOnModalClose } = useModal();

    const handleOpenModal = () => {
        setModalContent(
            <div>
                <h2>This is the Modal Content!</h2>
                <p>You can close this modal by clicking outside or adding a close button inside.</p>
            </div>
        );

        setOnModalClose(() => {
            console.log('Modal closed!');
        });
    };

    return (
        <button onClick={handleOpenModal}>Open Modal</button>
    );
}

export default ButtonComponent;
