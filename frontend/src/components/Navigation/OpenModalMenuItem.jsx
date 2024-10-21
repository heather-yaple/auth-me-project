// src/components/Navigation/OpenModalMenuItem.jsx


import PropTypes from 'prop-types'; // Import PropTypes for type checking
import { useModal } from '../../components/context/Modal';
import './OpenModalMenuItem.css'; // Optional: If you have specific styles

const OpenModalMenuItem = React.memo(({ modalComponent, itemText, onItemClick, onModalClose }) => {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onItemClick) onItemClick();
  };

  return (
    <li className="menu-item">
      <button 
        onClick={onClick} 
        className="dropdown-item" 
        aria-label={`Open ${itemText} modal`} // Accessibility enhancement
      >
        {itemText}
      </button>
    </li>
  );
});

// PropTypes for type checking
OpenModalMenuItem.propTypes = {
  modalComponent: PropTypes.element.isRequired,
  itemText: PropTypes.string.isRequired,
  onItemClick: PropTypes.func,
  onModalClose: PropTypes.func,
};

export default OpenModalMenuItem;
