import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReview } from '../../store/reviews';
import './ReviewFormModal.css';

const ReviewFormModal = ({ spotId, onClose }) => {
  const dispatch = useDispatch();

  const [reviewText, setReviewText] = useState('');
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState([]);
  const [hoveredStar, setHoveredStar] = useState(0); // For hover feedback

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = [];
    if (reviewText.length < 10)
      validationErrors.push('Review must be at least 10 characters');
    if (stars < 1 || stars > 5)
      validationErrors.push('Please provide a star rating between 1 and 5');

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const reviewData = {
      review: reviewText,
      stars,
    };

    try {
      await dispatch(createReview(spotId, reviewData));
      onClose(); // Close the modal upon successful submission
      setReviewText(''); // Reset the form
      setStars(0); // Reset star rating
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) setErrors(Object.values(data.errors));
    }
  };

  return (
    <div className="review-form-modal">
      <h2>How was your stay?</h2>
      {errors.length > 0 && (
        <ul className="errors">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit}>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Leave your review here..."
          required
          aria-label="Review text"
        ></textarea>
        <div className="stars-input">
          <div className="star-rating">
            {[...Array(5)].map((star, idx) => {
              idx += 1;
              return (
                <button
                  type="button"
                  key={idx}
                  className={idx <= (hoveredStar || stars) ? 'on' : 'off'}
                  onClick={() => setStars(idx)}
                  onMouseEnter={() => setHoveredStar(idx)}
                  onMouseLeave={() => setHoveredStar(0)}
                  aria-label={`Select ${idx} star`}
                >
                  <span className="star">&#9733;</span>
                </button>
              );
            })}
          </div>
          <span>Stars</span>
        </div>
        <button
          type="submit"
          disabled={reviewText.length < 10 || stars === 0}
          aria-label="Submit review"
        >
          Submit Your Review
        </button>
      </form>
    </div>
  );
};

export default ReviewFormModal;

