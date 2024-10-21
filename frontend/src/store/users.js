// frontend/src/store/users.js

import { csrfFetch } from './csrf';

// Action Types
const SET_USERS = 'users/setUsers';
const SET_USER = 'users/setUser';
const REMOVE_USER = 'users/removeUser';

// Action Creators
const setUsers = (users) => ({
  type: SET_USERS,
  payload: users,
});

const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = (userId) => ({
  type: REMOVE_USER,
  payload: userId,
});

// Thunks
export const fetchUsers = (page = 1, size = 10) => async (dispatch) => {
  const response = await csrfFetch(`/api/users?page=${page}&size=${size}`);
  const data = await response.json();
  dispatch(setUsers(data.users));
  return response;
};

// Fetch a specific user by ID
export const fetchUserById = (userId) => async (dispatch) => {
  const response = await csrfFetch(`/api/users/${userId}`);
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// Delete a user
export const deleteUser = (userId) => async (dispatch) => {
  const response = await csrfFetch(`/api/users/${userId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    dispatch(removeUser(userId));
  }
};

// Initial State
const initialState = {
  users: [],
  user: null,
};

// Reducer
const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS:
      return { ...state, users: action.payload };
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, users: state.users.filter(user => user.id !== action.payload) };
    default:
      return state;
  }
};

export default usersReducer;
