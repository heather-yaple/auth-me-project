// reviews.js
import { csrfFetch } from './csrf';

const SET_REVIEWS = 'reviews/setReviews';
const ADD_REVIEW = 'reviews/addReview';
const DELETE_REVIEW = 'reviews/deleteReview';

export const setReviews = (spotId, reviews) => ({
  type: SET_REVIEWS,
  spotId,
  reviews,
});

export const addReview = (review) => ({
  type: ADD_REVIEW,
  review,
});

export const removeReview = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId,
});

// Thunks
export const fetchReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const reviews = await response.json();
    dispatch(setReviews(spotId, reviews));
  }
};

export const createReview = (review) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews`, {
    method: 'POST',
    body: JSON.stringify(review),
  });
  if (response.ok) {
    const newReview = await response.json();
    dispatch(addReview(newReview));
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    dispatch(removeReview(reviewId));
  }
};

// Reducer
const reviewsReducer = (state = {}, action) => {
  const newState = { ...state };

  switch (action.type) {
    case SET_REVIEWS:
      newState[action.spotId] = action.reviews;
      break;

    case ADD_REVIEW:
      newState[action.review.spotId] =
        (newState[action.review.spotId] || []).concat(action.review);
      break;

    case DELETE_REVIEW:
      newState[action.review.spotId] = newState[action.review.spotId].filter(
        (review) => review.id !== action.reviewId
      );
      break;

    default:
      return state;
  }

  return newState;
};

export default reviewsReducer;
