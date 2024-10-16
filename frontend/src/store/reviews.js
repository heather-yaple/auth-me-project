// store/reviews.js

// Action types
const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
const ADD_REVIEW = 'reviews/ADD_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

// Action creators
const loadReviews = reviews => ({
  type: LOAD_REVIEWS,
  reviews
});

const addReview = review => ({
  type: ADD_REVIEW,
  review
});

const deleteReview = reviewId => ({
  type: DELETE_REVIEW,
  reviewId
});

// Thunks
export const fetchReviews = spotId => async dispatch => {
  const response = await fetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const reviews = await response.json();
    dispatch(loadReviews(reviews));
  }
};

export const createReview = (spotId, reviewData) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData)
  });

  if (response.ok) {
    const review = await response.json();
    dispatch(addReview(review));
  }
};

export const deleteReview = reviewId => async dispatch => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    dispatch(deleteReview(reviewId));
  }
};

// Reducer
const reviewsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_REVIEWS:
      const reviews = {};
      action.reviews.forEach(review => {
        reviews[review.id] = review;
      });
      return reviews;

    case ADD_REVIEW:
      return {
        ...state,
        [action.review.id]: action.review
      };

    case DELETE_REVIEW:
      const newState = { ...state };
      delete newState[action.reviewId];
      return newState;

    default:
      return state;
  }
};

export default reviewsReducer;

