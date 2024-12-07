// src/components/ReviewsList/ReviewsList.jsx

import { useSelector } from 'react-redux';
import ReviewItem from '../ReviewItem/ReviewItem';
import './ReviewsList.css';

const ReviewsList = ({ cabin, user }) => {
  const reviewsObject = useSelector((state) => state.reviews.cabinReviews);
  const reviews = Object.values(reviewsObject).reverse(); 

  if (!reviews.length) {
    return (
      <div>
        {user && user.id !== cabin.ownerId ? (
          <p>Be the first to post a review!</p>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    );
  }

  return (
    <div className="reviews-list">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewsList;
