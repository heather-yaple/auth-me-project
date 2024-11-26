// Constants
const SET_REVIEWS = 'reviews/SET_REVIEWS';
const ADD_REVIEW = 'reviews/ADD_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';
const SET_REVIEWS_ERROR = 'reviews/SET_REVIEWS_ERROR'; // Added error handling action type

// Action creators
const setReviews = (reviews) => ({
  type: SET_REVIEWS,
  reviews,
});

const addReview = (review) => ({
  type: ADD_REVIEW,
  review,
});

const removeReview = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId,
});

const setReviewsError = (error) => ({
  type: SET_REVIEWS_ERROR,
  error,
});

// Thunk actions
import { csrfFetch } from './csrf';

export const getReviewsBySpotId = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
      const data = await response.json();
      dispatch(setReviews(data.Reviews));
    } else {
      const errors = await response.json();
      dispatch(setReviewsError(errors)); // Dispatching error action
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    dispatch(setReviewsError(error)); // Dispatching error action
  }
};

// Add a new review
import { getSpotDetails } from './spots';

export const createReview = (spotId, reviewData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });

    if (response.ok) {
      const newReview = await response.json();
      const userResponse = await csrfFetch('/api/session');
      const userData = await userResponse.json();
      newReview.User = {
        id: userData.user.id,
        firstName: userData.user.firstName,
        lastName: userData.user.lastName,
      };
      dispatch(addReview(newReview));  // Add review to store immediately
      dispatch(getSpotDetails(spotId));  // Refresh spot details
      return newReview;
    } else {
      const errors = await response.json();
      throw errors;
    }
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;  // Propagate error to handle elsewhere
  }
};

// Delete a review
export const deleteReview = (reviewId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      dispatch(removeReview(reviewId));  // Remove review from state
    } else {
      const errors = await response.json();
      throw errors;
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;  // Propagate error
  }
};

// Reducer
const initialState = {
  spotReviews: {},
  error: null,  // Added error field in state to handle errors
};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REVIEWS: {
      const newState = { ...state, spotReviews: {} };
      action.reviews.forEach((review) => {
        newState.spotReviews[review.id] = review;
      });
      return newState;
    }
    case ADD_REVIEW: {
      return {
        ...state,
        spotReviews: {
          ...state.spotReviews,
          [action.review.id]: action.review,
        },
      };
    }
    case DELETE_REVIEW: {
      const newState = {
        ...state,
        spotReviews: { ...state.spotReviews },
      };
      delete newState.spotReviews[action.reviewId];
      return newState;
    }
    case SET_REVIEWS_ERROR: {  // Handling error action
      return {
        ...state,
        error: action.error,
      };
    }
    default:
      return state;
  }
};

export default reviewsReducer;

