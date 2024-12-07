import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getcabinDetails } from "../../store/cabins";
import { getReviewsBycabinId } from "../../store/reviews";
import ReviewsList from "../ReviewsList/ReviewsList";
import ReviewFormModal from "../ReviewFormModal/ReviewFormModal";
import { useModal } from "../context/Modal";
import "./cabinDetails.css";

const cabinDetails = () => {
  const { cabinId } = useParams();
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal();

  const cabin = useSelector((state) => state.cabins.singlecabin);
  const user = useSelector((state) => state.session.user);

  const reviewsObject = useSelector((state) => state.reviews.cabinReviews);
  const reviews = useMemo(() => Object.values(reviewsObject), [reviewsObject]);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      dispatch(getcabinDetails(cabinId)),
      dispatch(getReviewsBycabinId(cabinId)),
    ])
      .then(() => setIsLoaded(true))
      // eslint-disable-next-line no-unused-vars
      .catch((err) => {});
  }, [dispatch, cabinId]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!cabin.id) return <div>cabin not found</div>;

  const hasUserReviewed = reviews.some((review) => review.userId === user?.id);

  const canPostReview = user && user.id !== cabin.ownerId && !hasUserReviewed;

  const openReviewModal = () => {
    setModalContent(<ReviewFormModal cabinId={cabin.id} onClose={closeModal} />);
  };

  return (
    <div className="cabin-details">
      <h1>{cabin.name}</h1>
      <div className="cabin-location">
        {cabin.city}, {cabin.state}, {cabin.country}
      </div>

      <div className="cabin-images">
        {cabin.cabinImages && cabin.cabinImages.length > 0 ? (
          <>
            <div className="main-image">
              <img src={cabin.cabinImages[0].url} alt={cabin.name} />
            </div>
            <div className="thumbnail-images">
              {cabin.cabinImages.slice(1, 5).map((image, idx) => (
                <img
                  key={idx}
                  src={image.url}
                  alt={`${cabin.name} ${idx + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div>No images available</div>
        )}
      </div>

      <div className="cabin-info">
        <div className="cabin-host">
          <h2>
            Hosted by {cabin.Owner?.firstName} {cabin.Owner?.lastName}
          </h2>
          <p>{cabin.description}</p>
        </div>

        <div className="cabin-callout">
          <div className="price-rating-container">
            <div className="price">
              ${cabin.price}
              <span className="night-text"> night</span>
            </div>
            <div className="cabin-rating-callout">
              <i className="fas fa-star"></i>{" "}
              {cabin.avgStarRating
                ? Number(cabin.avgStarRating).toFixed(1)
                : "New"}
              {cabin.numReviews > 0 && (
                <>
                  {" · "}
                  {cabin.numReviews} review{cabin.numReviews === 1 ? "" : "s"}
                </>
              )}
            </div>
          </div>
          <div
            className="reserve-button"
            onClick={() => alert("Feature coming soon")}
          >
            Reserve
          </div>
        </div>
      </div>
      <hr className="divider" />

      <div className="reviews-section">
  <h2>
    <i className="fas fa-star"></i>{' '}
    {cabin.avgStarRating ? Number(cabin.avgStarRating).toFixed(1) : 'New'}
    {cabin.numReviews > 0 && (
      <>
        {' · '}
        {cabin.numReviews} review{cabin.numReviews === 1 ? '' : 's'}
      </>
    )}
  </h2>

  {canPostReview && (
    <button onClick={openReviewModal} className="post-review-button">
      Post Your Review
    </button>
  )}

  {cabin.numReviews === 0 ? (
    <p>Be the first to post a review!</p>
  ) : (
    <ReviewsList reviews={reviews} cabin={cabin} user={user} />
  )}
</div>
    </div>
  );
};

export default cabinDetails;
