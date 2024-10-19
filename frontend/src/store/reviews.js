//store/reviews.js

const SET_REVIEWS = 'reviews/SET_REVIEWS';
const ADD_REVIEW = 'reviews/ADD_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';


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
  
  
  import { csrfFetch } from './csrf';

export const getReviewsBySpotId = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const data = await response.json();
    dispatch(setReviews(data.Reviews));
  } else {
    // Handle errors
  }
};

//add a new review
import { getSpotDetails } from './spots';

export const createReview = (spotId, reviewData) => async (dispatch) => {
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
      dispatch(addReview(newReview));
      dispatch(getSpotDetails(spotId));
      return newReview;
    } else {
      const errors = await response.json();
      throw errors;
    }
  };

  //delete a review
  export const deleteReview = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  
    if (response.ok) {
      dispatch(removeReview(reviewId));
    } else {
      const errors = await response.json();
      throw errors;
    }
  };
  
  

  //reducer
const initialState = {
    spotReviews: {},
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
        console.log('Review deleted:', action.reviewId);
        console.log('Updated state:', newState);
        return newState;
      }
      default: return state;
    }  
  };
  
  export default reviewsReducer;

