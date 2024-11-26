import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { csrfFetch } from './csrf';

// Async Thunks
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (page = 1, size = 10) => {
  const response = await csrfFetch(`/api/users?page=${page}&size=${size}`);
  const data = await response.json();
  return data.users;
});

export const fetchUserById = createAsyncThunk('users/fetchUserById', async (userId) => {
  const response = await csrfFetch(`/api/users/${userId}`);
  const data = await response.json();
  return data.user;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
  const response = await csrfFetch(`/api/users/${userId}`, { method: 'DELETE' });
  if (response.ok) return userId;
});

// Slice
const usersSlice = createSlice({
  name: 'users',
  initialState: { users: [], user: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
