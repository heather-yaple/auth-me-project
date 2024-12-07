/* eslint-disable no-case-declarations */
// src/store/cabins.js

import { csrfFetch } from "./csrf";

// action types
const SET_cabins = "cabins/SET_cabins";
const SET_cabin_DETAILS = "cabins/SET_cabin_DETAILS";
const ADD_cabin = "cabins/ADD_cabin";
const SET_USER_cabins = "cabins/SET_USER_cabins";
const REMOVE_cabin = "cabins/REMOVE_cabin";
const UPDATE_cabin = "cabins/UPDATE_cabin";
const UPDATE_cabin_DETAILS = 'cabins/UPDATE_cabin_DETAILS';

// action creators
const setcabins = (cabins) => ({
  type: SET_cabins,
  cabins,
});

const setcabinDetails = (cabin) => ({
  type: SET_cabin_DETAILS,
  cabin,
});

const addcabin = (cabin) => ({
  type: ADD_cabin,
  cabin,
});

const setUsercabins = (cabins) => ({
  type: SET_USER_cabins,
  cabins,
});

const removecabin = (cabinId) => ({
  type: REMOVE_cabin,
  cabinId,
});

const updatecabinAction = (cabin) => ({
  type: UPDATE_cabin,
  cabin,
});




// Fetch all cabins
export const getAllcabins = () => async (dispatch) => {
  const response = await fetch("/api/cabins");
  if (response.ok) {
    const data = await response.json();

    const cabins = {};
    data.cabins.forEach((cabin) => {
      cabins[cabin.id] = cabin;
    });

    dispatch(setcabins(cabins));
  }
};

// Fetch cabin details
export const getcabinDetails = (cabinId) => async (dispatch) => {
  const response = await fetch(`/api/cabins/${cabinId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(setcabinDetails(data));
    return data;
  } else { /* empty */ }
};

// Create a new cabin
export const createcabin = (cabinData, imageUrls) => async (dispatch) => {
  const response = await csrfFetch("/api/cabins", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cabinData),
  });

  if (response.ok) {
    const newcabin = await response.json();

    // Upload images after creating the cabin
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const preview = i === 0;

      await csrfFetch(`/api/cabins/${newcabin.id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageUrl, preview }),
      });
    }

    // Fetch cabin details for updated data
    const cabinDetailsResponse = await fetch(`/api/cabins/${newcabin.id}`);
    if (cabinDetailsResponse.ok) {
      const cabinDetails = await cabinDetailsResponse.json();
      dispatch(addcabin(cabinDetails));
      return cabinDetails;
    } else { /* empty */ }
  } else {
    const errors = await response.json();
    throw errors;
  }
};

// fetch current user's cabins
export const getCurrentUsercabins = () => async (dispatch) => {
  const response = await csrfFetch("/api/cabins/current");
  if (response.ok) {
    const data = await response.json();

    const cabins = {};
    data.cabins.forEach((cabin) => {
      cabins[cabin.id] = cabin;
    });

    dispatch(setUsercabins(cabins));
  }
};

//update a cabin
export const updatecabin = (cabinId, cabinData) => async (dispatch) => {
  const response = await csrfFetch(`/api/cabins/${cabinId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cabinData),
  });

  if (response.ok) {
    const updatedcabin = await response.json();
    dispatch(updatecabinAction(updatedcabin));
    return updatedcabin;
  } else {
    const errors = await response.json();
    throw errors;
  }
};

export const updatecabinDetails = (cabinId, avgStarRating, numReviews) => ({
  type: UPDATE_cabin_DETAILS,
  cabinId,
  avgStarRating,
  numReviews,
});


// delete a cabin
export const deletecabin = (cabinId) => async (dispatch) => {
  const response = await csrfFetch(`/api/cabins/${cabinId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(removecabin(cabinId));
  } else { /* empty */ }
};

// reducer
const initialState = {
  allcabins: {},
  singlecabin: {},
  usercabins: {},
};

const cabinsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_cabins:
      return {
        ...state,
        allcabins: { ...action.cabins },
      };
    case SET_cabin_DETAILS:
      return {
        ...state,
        singlecabin: { ...action.cabin },
      };
    case ADD_cabin:
      return {
        ...state,
        allcabins: {
          ...state.allcabins,
          [action.cabin.id]: action.cabin,
        },
        singlecabin: { ...action.cabin },
      };
    case SET_USER_cabins:
      return {
        ...state,
        usercabins: { ...action.cabins },
      };
    case UPDATE_cabin:
      return {
        ...state,
        allcabins: {
          ...state.allcabins,
          [action.cabin.id]: action.cabin,
        },
        usercabins: {
          ...state.usercabins,
          [action.cabin.id]: action.cabin,
        },
        singlecabin: {
          ...action.cabin,
        },
      };
    case REMOVE_cabin:
      const newAllcabins = { ...state.allcabins };
      const newUsercabins = { ...state.usercabins };
      delete newAllcabins[action.cabinId];
      delete newUsercabins[action.cabinId];
      return {
        ...state,
        allcabins: newAllcabins,
        usercabins: newUsercabins,
      };
      case UPDATE_cabin_DETAILS:
        return {
          ...state,
          singlecabin: {
            ...state.singlecabin,
            avgStarRating: action.avgStarRating,
            numReviews: action.numReviews,
          },
          allcabins: {
            ...state.allcabins,
            [action.cabinId]: {
              ...state.allcabins[action.cabinId],
              avgStarRating: action.avgStarRating,
              numReviews: action.numReviews,
            },
          },
          usercabins: {
            ...state.usercabins,
            [action.cabinId]: {
              ...state.usercabins[action.cabinId],
              avgStarRating: action.avgStarRating,
              numReviews: action.numReviews,
            },
          },
        };
    default:
      return state;
  }
};

export default cabinsReducer;