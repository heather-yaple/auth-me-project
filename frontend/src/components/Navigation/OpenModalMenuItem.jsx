// src/components/Navigation/OpenModalMenuItem.jsx

// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useModal } from '../../components/context/Modal';
import './OpenModalMenuItem.css'; // Optional: If you have specific styles

function OpenModalMenuItem({
  modalComponent,
  itemText,
  onItemClick,
  onModalClose
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onItemClick) onItemClick();
  };

  return (
    <li className="menu-item">
      <button onClick={onClick} className="dropdown-item">
        {itemText}
      </button>
    </li>
  );
}

export default OpenModalMenuItem;