import PropTypes from 'prop-types'; // Import PropTypes
import { useModal } from '../context/Modal';

const OpenModalButton = ({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose
}) => {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (typeof onButtonClick === 'function') onButtonClick();
    if (typeof onModalClose === 'function') setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };

  return <button onClick={onClick}>{buttonText}</button>;
};

// PropTypes for better type checking
OpenModalButton.propTypes = {
  modalComponent: PropTypes.element.isRequired,
  buttonText: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func,
  onModalClose: PropTypes.func,
};

// Display name for debugging purposes
OpenModalButton.displayName = "OpenModalButton";

const OpenModalMenuItem = () => {
  // Define functionality or UI for OpenModalMenuItem here
  return <div>Menu Item Component</div>; // Placeholder for rendering
};

// Display name for debugging purposes
OpenModalMenuItem.displayName = "OpenModalMenuItem";

// Export both components
export { OpenModalMenuItem };
export default OpenModalButton;
