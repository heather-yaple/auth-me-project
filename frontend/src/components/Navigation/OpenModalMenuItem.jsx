// import PropTypes from 'prop-types'; // Import PropTypes for type checking
// import { useModal } from '../../components/context/Modal'; // Assuming you have a modal context to manage state globally
// import './OpenModalMenuItem.css'; // Optional: If you have specific styles for the menu items

// const OpenModalMenuItem = React.memo(({ modalComponent, itemText, onItemClick, onModalClose }) => {
//   const { setModalContent, setOnModalClose } = useModal(); // Accessing modal context to manage state

//   // onClick event for triggering the modal
//   function onClick() {
//     // If there's an onModalClose prop, set it to the modal context to close the modal when needed
//     if (onModalClose) setOnModalClose(onModalClose);

//     // Set the modal content to display the passed modalComponent
//     setModalContent(modalComponent);

//     // Optionally trigger an additional callback action
//     if (onItemClick) onItemClick();
//   }

//   return (
//     <li className="menu-item">
//       <button 
//         onClick={onClick} 
//         className="dropdown-item" 
//         aria-label={`Open ${itemText} modal`} // Accessibility enhancement for button actions
//       >
//         {itemText}
//       </button>
//     </li>
//   );
// });

// // PropTypes for type-checking and ensuring the correct types are passed
// OpenModalMenuItem.propTypes = {
//   modalComponent: PropTypes.element.isRequired, // Expecting a React component for the modal
//   itemText: PropTypes.string.isRequired,       // The text to display on the button
//   onItemClick: PropTypes.func,                 // Optional callback for when the item is clicked
//   onModalClose: PropTypes.func,                // Optional callback for closing the modal
// };

// export default OpenModalMenuItem;

