/* eslint-disable no-case-declarations */
// src/store/spots.js

import { csrfFetch } from "./csrf";

// Action Types
const SET_SPOTS = "spots/SET_SPOTS";
const SET_SPOT_DETAILS = "spots/SET_SPOT_DETAILS";
const ADD_SPOT = "spots/ADD_SPOT";
const SET_USER_SPOTS = "spots/SET_USER_SPOTS";
const REMOVE_SPOT = "spots/REMOVE_SPOT";
const UPDATE_SPOT = "spots/UPDATE_SPOT";

// Action Creators
const setSpots = (spots) => ({
  type: SET_SPOTS,
  spots,
});

const setSpotDetails = (spot) => ({
  type: SET_SPOT_DETAILS,
  spot,
});

const addSpot = (spot) => ({
  type: ADD_SPOT,
  spot,
});

const setUserSpots = (spots) => ({
  type: SET_USER_SPOTS,
  spots,
});

const removeSpot = (spotId) => ({
  type: REMOVE_SPOT,
  spotId,
});

const updateSpotAction = (spot) => ({
  type: UPDATE_SPOT,
  spot,
});

// Thunks

// Fetch all spots
export const getAllSpots = () => async (dispatch) => {
  const response = await fetch("/api/spots");
  if (response.ok) {
    const data = await response.json();

    // Normalize spots data into an object with spot IDs as keys
    const spots = {};
    data.Spots.forEach((spot) => {
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
  } else {
    // Handle errors if necessary
  }
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
    const spotDetailsResponse = await fetch(`/api/spots/${newSpot.id}`);
    if (spotDetailsResponse.ok) {
      const spotDetails = await spotDetailsResponse.json();
      dispatch(addSpot(spotDetails));
      return spotDetails;
    } else {
      // Handle errors if necessary
    }
  } else {
    const errors = await response.json();
    throw errors;
  }
};

// Fetch current user's spots
export const getCurrentUserSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/current");
  if (response.ok) {
    const data = await response.json();

    const spots = {};
    data.Spots.forEach((spot) => {
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


// Delete a spot
export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(removeSpot(spotId));
  } else { /* empty */ }
};

// Reducer
const initialState = {
  allSpots: {},
  singleSpot: {},
  userSpots: {},
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPOTS:
      return {
        ...state,
        allSpots: { ...action.spots },
      };
    case SET_SPOT_DETAILS:
      return {
        ...state,
        singleSpot: { ...action.spot },
      };
    case ADD_SPOT:
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.spot.id]: action.spot,
        },
        singleSpot: { ...action.spot },
      };
    case SET_USER_SPOTS:
      return {
        ...state,
        userSpots: { ...action.spots },
      };
    case UPDATE_SPOT:
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
    case REMOVE_SPOT:
      const newAllSpots = { ...state.allSpots };
      const newUserSpots = { ...state.userSpots };
      delete newAllSpots[action.spotId];
      delete newUserSpots[action.spotId];
      return {
        ...state,
        allSpots: newAllSpots,
        userSpots: newUserSpots,
      };
    default:
      return state;
  }
};

export default spotsReducer;