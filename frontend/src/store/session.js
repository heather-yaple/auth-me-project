// frontend/src/store/session.js

import { csrfFetch } from './csrf';

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

// Sign-up new user
export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data.user));
    localStorage.setItem('user', JSON.stringify(data.user)); // Store user in localStorage
  } else {
    const data = await response.json();
    throw new Error(data.errors ? data.errors : 'Failed to sign up');
  }
};

// Login existing user
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({
      credential,
      password,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data.user));
    localStorage.setItem('user', JSON.stringify(data.user)); // Store user in localStorage
  } else {
    const data = await response.json();
    throw new Error(data.errors ? data.errors : 'Failed to log in');
  }
};

// Log out user
export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(removeUser());
  localStorage.removeItem('user'); // Clear user from localStorage
  return response;
};

// Restore user session from localStorage or API
export const restoreUser = () => async (dispatch) => {
  const storedUser = JSON.parse(localStorage.getItem('user'));

  if (storedUser) {
    dispatch(setUser(storedUser)); // Restore from localStorage
  } else {
    const response = await csrfFetch('/api/session');

    if (response.ok) {
      const data = await response.json();
      dispatch(setUser(data.user));
      localStorage.setItem('user', JSON.stringify(data.user)); // Store user in localStorage
    }
  }
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};

export default sessionReducer;
