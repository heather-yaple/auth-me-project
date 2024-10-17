// ReviewsList.jsx
// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews } from '../store/reviews'; // Import deleteReview action
import { deleteReviewThunk } from './store/reviews'; // Import the renamed thunk
import './styles/ReviewsList.css';
const ReviewsList = ({ spotId }) => {
  const dispatch = useDispatch();
  const reviews = useSelector(state => state.reviews[spotId] || []); // Handle undefined state gracefully

  useEffect(() => {
    dispatch(fetchReviews(spotId));
  }, [dispatch, spotId]);

  return (
    <div>
      <h3>Reviews</h3>
      <ul>
        {reviews.map(review => (
          <li key={review.id}>
            {review.content}
            <button onClick={() => dispatch(deleteReviewThunk(review.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewsList;

