// store/spots.js

// Action types
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_SINGLE_SPOT = 'spots/LOAD_SINGLE_SPOT';
const ADD_SPOT = 'spots/ADD_SPOT';
const UPDATE_SPOT = 'spots/UPDATE_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT';

// Action creators
const loadSpots = spots => ({
  type: LOAD_SPOTS,
  spots
});

const loadSingleSpot = spot => ({
  type: LOAD_SINGLE_SPOT,
  spot
});

const addSpot = spot => ({
  type: ADD_SPOT,
  spot
});

const updateSpot = spot => ({
  type: UPDATE_SPOT,
  spot
});

const deleteSpot = spotId => ({
  type: DELETE_SPOT,
  spotId
});

// Thunks (async functions)
export const fetchSpots = () => async dispatch => {
  const response = await fetch('/api/spots');
  if (response.ok) {
    const spots = await response.json();
    dispatch(loadSpots(spots));
  }
};

export const fetchSpot = spotId => async dispatch => {
  const response = await fetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const spot = await response.json();
    dispatch(loadSingleSpot(spot));
  }
};

export const createSpot = spotData => async dispatch => {
  // eslint-disable-next-line no-undef
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    body: JSON.stringify(spotData)
  });

  if (response.ok) {
    const spot = await response.json();
    dispatch(addSpot(spot));
  }
};

export const updateSpotData = (spotId, spotData) => async dispatch => {
  // eslint-disable-next-line no-undef
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    body: JSON.stringify(spotData)
  });

  if (response.ok) {
    const updatedSpot = await response.json();
    dispatch(updateSpot(updatedSpot));
  }
};

export const deleteSpotThunk = spotId => async dispatch => {
  // eslint-disable-next-line no-undef
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    dispatch(deleteSpot(spotId));
  }
};

// Reducer
const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      // eslint-disable-next-line no-case-declarations
      const spots = {};
      action.spots.forEach(spot => {
        spots[spot.id] = spot;
      });
      return spots;

    case LOAD_SINGLE_SPOT:
      return {
        ...state,
        [action.spot.id]: action.spot
      };

    case ADD_SPOT:
      return {
        ...state,
        [action.spot.id]: action.spot
      };

    case UPDATE_SPOT:
      return {
        ...state,
        [action.spot.id]: action.spot
      };

    case DELETE_SPOT:
      // eslint-disable-next-line no-case-declarations
      const newState = { ...state };
      delete newState[action.spotId];
      return newState;

    default:
      return state;
  }
};

export default spotsReducer;
