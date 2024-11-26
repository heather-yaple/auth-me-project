/* eslint-disable no-unused-vars */

// src/components/ReviewItem/ReviewItem.jsx

import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../context/Modal'; // Import useModal if using modal context
import DeleteReviewConfirmationModal from '../DeleteReviewConfirmationModal/DeleteReviewConfirmationModal';
import './ReviewItem.css';

const ReviewItem = ({ review }) => {
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal(); // Destructure from useModal

  const sessionUser = useSelector((state) => state.session.user);

  const openDeleteModal = () => {
    // Improved modal open logic with validation
    try {
      setModalContent(
        <DeleteReviewConfirmationModal
          reviewId={review.id}
          closeModal={closeModal}
        />
      );
    } catch (error) {
      console.error("Failed to open modal:", error);
    }
  };

  return (
    <div className="review-item">
      <div className="review-header">
        <h3>{review.User?.firstName}</h3>
        <p>{new Date(review.createdAt).toLocaleDateString()}</p>
      </div>
      <p>{review.review}</p>
      {sessionUser && sessionUser.id === review.userId && (
        <button
          onClick={openDeleteModal}
          className="delete-review-button"
          aria-label="Delete Review"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default ReviewItem;
