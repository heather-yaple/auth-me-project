// src/components/DeleteConfirmationModal/DeleteConfirmationModal.jsx

import  { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteSpot } from '../../store/spots';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ spotId, closeModal }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteSpot(spotId));
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
          Yes (Delete Cabin)
        </button>
        <button onClick={closeModal} className="cancel-button">
          No (Keep Cabin)
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
