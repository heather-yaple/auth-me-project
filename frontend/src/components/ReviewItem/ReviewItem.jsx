// src/components/ReviewItem/ReviewItem.jsx

import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../context/Modal'; 
import DeleteReviewConfirmationModal from '../DeleteReviewConfirmationModal/DeleteReviewConfirmationModal';
import './ReviewItem.css';

const ReviewItem = ({ review }) => {
  // eslint-disable-next-line no-unused-vars
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal(); 

  const sessionUser = useSelector((state) => state.session.user);

  const openDeleteModal = () => {
    setModalContent(
      <DeleteReviewConfirmationModal
        reviewId={review.id}
        closeModal={closeModal}
      />
    );
  };

  return (
    <div className="review-item">
      <div className="review-header">
        <h3>{review.User?.firstName}</h3>
        <p>{new Date(review.createdAt).toLocaleDateString()}</p>
      </div>
      <p>{review.review}</p>
      {sessionUser && sessionUser.id === review.userId && (
        <button onClick={openDeleteModal} className="delete-review-button">
          Delete
        </button>
      )}
    </div>
  );
};

export default ReviewItem;
