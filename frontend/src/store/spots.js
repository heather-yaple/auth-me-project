/* eslint-disable no-case-declarations */
// src/store/spots.js

import { csrfFetch } from "./csrf";

// action types
const SET_spots = "spots/SET_spots";
const SET_spot_DETAILS = "spots/SET_spot_DETAILS";
const ADD_spot = "spots/ADD_spot";
const SET_USER_spots = "spots/SET_USER_spots";
const REMOVE_spot = "spots/REMOVE_spot";
const UPDATE_spot = "spots/UPDATE_spot";
const UPDATE_spot_DETAILS = 'spots/UPDATE_spot_DETAILS';

// action creators
const setSpots = (spots) => ({
  type: SET_spots,
  spots,
});

const setSpotDetails = (spot) => ({
  type: SET_spot_DETAILS,
  spot,
});

const addSpot = (spot) => ({
  type: ADD_spot,
  spot,
});

const setUserSpots = (spots) => ({
  type: SET_USER_spots,
  spots,
});

const removeSpot = (spotId) => ({
  type: REMOVE_spot,
  spotId,
});

const updateSpotAction = (spot) => ({
  type: UPDATE_spot,
  spot,
});




// Fetch all spots
export const getAllSpots = () => async (dispatch) => {
  const response = await fetch("/api/spots");
  if (response.ok) {
    const data = await response.json();

    const spots = {};
    data.spots.forEach((spot) => {
      spots[spot.id] = spot;
    });

    dispatch(setSpots(spots));
  }
};

// Fetch spot details
export const getSpotDetails = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(setSpotDetails(data));
    return data;
  } else { /* empty */ }
};

// Create a new spot
export const createSpot = (spotData, imageUrls) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spotData),
  });

  if (response.ok) {
    const newSpot = await response.json();

    // Upload images after creating the spot
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const preview = i === 0;

      await csrfFetch(`/api/spots/${newSpot.id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageUrl, preview }),
      });
    }

    // Fetch spot details for updated data
    const SpotDetailsResponse = await fetch(`/api/spots/${newSpot.id}`);
    if (SpotDetailsResponse.ok) {
      const SpotDetails = await SpotDetailsResponse.json();
      dispatch(addSpot(SpotDetails));
      return SpotDetails;
    } else { /* empty */ }
  } else {
    const errors = await response.json();
    throw errors;
  }
};

// fetch current user's spots
export const getCurrentUserSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/current");
  if (response.ok) {
    const data = await response.json();

    const spots = {};
    data.spots.forEach((spot) => {
      spots[spot.id] = spot;
    });

    dispatch(setUserSpots(spots));
  }
};

//update a spot
export const updateSpot = (spotId, spotData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spotData),
  });

  if (response.ok) {
    const updatedSpot = await response.json();
    dispatch(updateSpotAction(updatedSpot));
    return updatedSpot;
  } else {
    const errors = await response.json();
    throw errors;
  }
};

export const updateSpotDetails = (spotId, avgStarRating, numReviews) => ({
  type: UPDATE_spot_DETAILS,
  spotId,
  avgStarRating,
  numReviews,
});


// delete a spot
export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(removeSpot(spotId));
  } else { /* empty */ }
};

// reducer
const initialState = {
  allSpots: {},
  singleSpot: {},
  userSpots: {},
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_spots:
      return {
        ...state,
        allspots: { ...action.spots },
      };
    case SET_spot_DETAILS:
      return {
        ...state,
        singlespot: { ...action.spot },
      };
    case ADD_spot:
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.spot.id]: action.spot,
        },
        singleSpot: { ...action.spot },
      };
    case SET_USER_spots:
      return {
        ...state,
        userSpots: { ...action.spots },
      };
    case UPDATE_spot:
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.spot.id]: action.spot,
        },
        userSpots: {
          ...state.userSpots,
          [action.spot.id]: action.spot,
        },
        singleSpot: {
          ...action.spot,
        },
      };
    case REMOVE_spot:
      const newAllSpots = { ...state.allSpots };
      const newUserSpots = { ...state.userSpots };
      delete newAllSpots[action.spotId];
      delete newUserSpots[action.spotId];
      return {
        ...state,
        allSpots: newAllSpots,
        userSpots: newUserSpots,
      };
      case UPDATE_spot_DETAILS:
        return {
          ...state,
          singleSpot: {
            ...state.singleSpot,
            avgStarRating: action.avgStarRating,
            numReviews: action.numReviews,
          },
          allSpots: {
            ...state.allSpots,
            [action.spotId]: {
              ...state.allSpots[action.spotId],
              avgStarRating: action.avgStarRating,
              numReviews: action.numReviews,
            },
          },
          userSpots: {
            ...state.userSpots,
            [action.spotId]: {
              ...state.userSpots[action.spotId],
              avgStarRating: action.avgStarRating,
              numReviews: action.numReviews,
            },
          },
        };
    default:
      return state;
  }
};

export default spotsReducer;