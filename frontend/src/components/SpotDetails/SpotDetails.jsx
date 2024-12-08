import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotDetails } from "../../store/spots";
import { getReviewsBySpotId } from "../../store/reviews";
import ReviewsList from "../ReviewsList/ReviewsList";
import ReviewFormModal from "../ReviewFormModal/ReviewFormModal";
import { useModal } from "../context/Modal";
import "./SpotDetails.css";

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal();

  const spot = useSelector((state) => state.spots.singleSpot);
  const user = useSelector((state) => state.session.user);

  const reviewsObject = useSelector((state) => state.reviews.spotReviews);
  const reviews = useMemo(() => Object.values(reviewsObject), [reviewsObject]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      dispatch(getSpotDetails(spotId)),
      dispatch(getReviewsBySpotId(spotId)),
    ])
      .then(() => setIsLoaded(true))
      .catch((err) => {
        console.error("Failed to fetch spot or reviews:", err);
        setError("Failed to load spot details. Please try again later.");
      });
  }, [dispatch, spotId]);

  if (error) return <div>{error}</div>;
  if (!isLoaded) return <div>Loading...</div>;
  if (!spot.id) return <div>Cabin not found</div>;

  const hasUserReviewed = reviews.some((review) => review.userId === user?.id);

  const canPostReview = user && user.id !== spot.ownerId && !hasUserReviewed;

  const openReviewModal = () => {
    setModalContent(<ReviewFormModal spotId={spot.id} onClose={closeModal} />);
  };

  const handleReserveClick = () => {
    // Implement reservation logic here
    alert("Feature coming soon");
  };

  return (
    <div className="spot-details">
      <h1>{spot.name}</h1>
      <div className="spot-location">
        {spot.city}, {spot.state}, {spot.country}
      </div>

      <div className="spot-images">
        {spot.spotImages && spot.spotImages.length > 0 ? (
          <>
            <div className="main-image">
              <img src={spot.spotImages[0].url} alt={spot.name} />
            </div>
            <div className="thumbnail-images">
              {spot.spotImages.slice(1, 5).map((image, idx) => (
                <img
                  key={idx}
                  src={image.url}
                  alt={`${spot.name} ${idx + 1}`}
                />
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
            Hosted by{" "}
            {spot.Owner?.firstName || "Unknown"} {spot.Owner?.lastName || ""}
          </h2>
          <p>{spot.description}</p>
        </div>

        <div className="spot-callout">
          <div className="price-rating-container">
            <div className="price">
              ${spot.price}
              <span className="night-text"> night</span>
            </div>
            <div className="spot-rating-callout">
              <i className="fas fa-star"></i>{" "}
              {spot.avgStarRating
                ? Number(spot.avgStarRating).toFixed(1)
                : "New"}
              {spot.numReviews > 0 && (
                <>
                  {" · "}
                  {spot.numReviews} review{spot.numReviews === 1 ? "" : "s"}
                </>
              )}
            </div>
          </div>
          <div
            className="reserve-button"
            onClick={handleReserveClick}
          >
            Reserve
          </div>
        </div>
      </div>
      <hr className="divider" />

      <div className="reviews-section">
        <h2>
          <i className="fas fa-star"></i>{" "}
          {spot.avgStarRating ? Number(spot.avgStarRating).toFixed(1) : "New"}
          {spot.numReviews > 0 && (
            <>
              {" · "}
              {spot.numReviews} review{spot.numReviews === 1 ? "" : "s"}
            </>
          )}
        </h2>

        {canPostReview && (
          <button onClick={openReviewModal} className="post-review-button">
            Post Your Review
          </button>
        )}

        {spot.numReviews === 0 ? (
          <p>Be the first to post a review!</p>
        ) : (
          <ReviewsList reviews={reviews} spot={spot} user={user} />
        )}
      </div>
    </div>
  );
};

export default SpotDetails;
