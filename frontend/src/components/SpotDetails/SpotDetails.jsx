import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSpotDetails } from '../../store/spots';
import { getReviewsBySpotId } from '../../store/reviews';
import ReviewsList from '../ReviewsList/ReviewsList';
import ReviewFormModal from '../ReviewFormModal/ReviewFormModal';
import { useModal } from '../context/Modal'; // Import useModal
import './SpotDetails.css';

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal(); // Use modal context

  const spot = useSelector((state) => state.spots.singleSpot);
  const user = useSelector((state) => state.session.user);

  const reviewsObject = useSelector((state) => state.reviews.spotReviews);
  const reviews = useMemo(() => Object.values(reviewsObject), [reviewsObject]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null); // New state to manage errors

  useEffect(() => {
    Promise.all([
      dispatch(getSpotDetails(spotId)),
      dispatch(getReviewsBySpotId(spotId)),
    ])
      .then(() => setIsLoaded(true))
      .catch((err) => {
        console.error('Error loading spot details or reviews:', err);
        setError('There was an error loading the spot details. Please try again later.');
      });
  }, [dispatch, spotId]);

  if (error) return <div className="error-message">{error}</div>;
  if (!isLoaded) return <div className="loading-spinner">Loading...</div>; // Replace with spinner if necessary
  if (!spot.id) return <div>Spot not found</div>;

  // Review eligibility checks
  const hasUserReviewed = reviews.some(
    (review) => review.userId === user?.id
  );

  const canPostReview =
    user && user.id !== spot.ownerId && !hasUserReviewed;

  // Function to open the review modal
  const openReviewModal = () => {
    setModalContent(
      <ReviewFormModal
        spotId={spot.id}
        onClose={closeModal}
      />
    );
  };

  return (
    <div className="spot-details">
      <h1>{spot.name}</h1>
      <div className="spot-location">
        {spot.city}, {spot.state}, {spot.country}
      </div>
      <div className="spot-images">
        {spot.SpotImages && spot.SpotImages.length > 0 ? (
          <>
            <div className="main-image">
              <img src={spot.SpotImages[0].url} alt={spot.name} />
            </div>
            <div className="thumbnail-images">
              {spot.SpotImages.slice(1, 5).map((image, idx) => (
                <img key={idx} src={image.url} alt={`${spot.name} ${idx + 1}`} />
              ))}
            </div>
          </>
        ) : (
          <div>No images available</div>
        )}
      </div>

      <div className="spot-info">
        <div className="spot-host">
          <h2>
            Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
          </h2>
          <p>{spot.description}</p>
        </div>
        <div className="spot-callout">
          <div className="price">${spot.price} / night</div>
          <div className="spot-rating">
            <i className="fas fa-star"></i>{' '}
            {spot.avgStarRating ? Number(spot.avgStarRating).toFixed(1) : 'New'}
            {' · '}
            {spot.numReviews} review{spot.numReviews === 1 ? '' : 's'}
          </div>
          <div
            className="reserve-button"
            onClick={() => alert('Feature coming soon')}
          >
            Reserve
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>
          <i className="fas fa-star"></i>{' '}
          {spot.avgStarRating ? Number(spot.avgStarRating).toFixed(1) : 'New'}
          {' · '}
          {spot.numReviews} review{spot.numReviews === 1 ? '' : 's'}
        </h2>

        {canPostReview && (
          <button onClick={openReviewModal}>
            Post Your Review
          </button>
        )}

        <ReviewsList reviews={reviews} spot={spot} user={user} />
      </div>
    </div>
  );
};

export default SpotDetails;
