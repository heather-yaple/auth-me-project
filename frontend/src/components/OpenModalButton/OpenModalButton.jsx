import PropTypes from 'prop-types';
import { useModal } from '../context/Modal';

const OpenModalMenuItem = ({
  modalComponent,
  itemText,
  onItemClick,
  onModalClose
}) => {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    // Call the onItemClick function if provided
    if (typeof onItemClick === 'function') onItemClick();

    // Set the modal content
    setModalContent(modalComponent);

    // Set the onModalClose handler if provided
    if (typeof onModalClose === 'function') setOnModalClose(onModalClose);
  };

  return (
    <li>
      <button onClick={onClick} className="modal-menu-item">
        {itemText}
      </button>
    </li>
  );
};

// PropTypes for type-checking
OpenModalMenuItem.propTypes = {
  modalComponent: PropTypes.element.isRequired,
  itemText: PropTypes.string.isRequired,
  onItemClick: PropTypes.func,
  onModalClose: PropTypes.func,
};

// Display name for debugging purposes
OpenModalMenuItem.displayName = "OpenModalMenuItem";

export default OpenModalMenuItem;

