// src/components/DeleteConfirmationModal/DeleteConfirmationModal.jsx

import  { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deletecabin } from '../../store/cabins';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ cabinId, closeModal }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);

  const handleDelete = async () => {
    try {
      await dispatch(deletecabin(cabinId));
      closeModal(); 
    } catch (err) {
      const errorMessages = err.errors ? Object.values(err.errors) : [];
      setErrors(errorMessages);
    }
  };

  return (
    <div className="delete-confirmation-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this cabin from the listings?</p>
      {errors.length > 0 && (
        <ul className="errors">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
      )}
      <div className="modal-buttons">
        <button onClick={handleDelete} className="confirm-delete-button">
          Yes (Delete cabin)
        </button>
        <button onClick={closeModal} className="cancel-button">
          No (Keep cabin)
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
