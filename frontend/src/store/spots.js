// spots.js (Redux slice or actions)
import { csrfFetch } from './csrf';

// Action Types
const SET_SPOT = 'spots/setSpot';
const REMOVE_SPOT = 'spots/removeSpot';

// Action Creators
export const setSpot = (spot) => ({
  type: SET_SPOT,
  spot,
});

export const removeSpot = (spotId) => ({
  type: REMOVE_SPOT,
  spotId,
});

// Thunks
export const fetchSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const spot = await response.json();
    dispatch(setSpot(spot));
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    dispatch(removeSpot(spotId));
  }
};

// Reducer
const initialState = {};
export const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPOT:
      return { ...state, [action.spot.id]: action.spot };
    case REMOVE_SPOT:
      return { ...state, [action.spotId]: undefined };
    default:
      return state;
  }
};

export default spotsReducer;