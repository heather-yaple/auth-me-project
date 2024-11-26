
import { useSelector } from 'react-redux';
import ReviewItem from '../ReviewItem/ReviewItem';
import './ReviewsList.css';

const ReviewsList = ({ spot, user }) => {
  const reviewsObject = useSelector((state) => state.reviews.spotReviews);
  const reviews = Object.values(reviewsObject).reverse(); // Show latest reviews first

  if (!reviews.length) {
    return (
      <div className="no-reviews">
        {user && user.id !== spot.ownerId ? (
          <>
            <p>Be the first to post a review!</p>
            <button className="leave-review-btn">Leave a Review</button>
          </>
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
