// src/components/DeleteReviewConfirmationModal/DeleteReviewConfirmationModal.jsx

import  { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteReview } from '../../store/reviews';
import './DeleteReviewConfirmationModal.css';

const DeleteReviewConfirmationModal = ({ reviewId, closeModal }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteReview(reviewId));
      closeModal(); // Close the modal after deletion
    } catch (err) {
      const errorMessages = err.errors ? Object.values(err.errors) : ["An unexpected error occurred. Please try again later."];
      setErrors(errorMessages);
    }
  };

  const handleBackgroundClick = (e) => {
    if (e.target.id === "modal-background") closeModal();
  };

  return (
    <div id="modal-background" className="modal-background" onClick={handleBackgroundClick}>
      <div className="delete-review-confirmation-modal">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this review?</p>
        {errors.length > 0 && (
          <ul className="errors">
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        )}
        <div className="modal-buttons">
          <button onClick={handleDelete} className="confirm-delete-button">
            Yes (Delete Review)
          </button>
          <button onClick={closeModal} className="cancel-button">
            No (Keep Review)
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReviewConfirmationModal;

