import { UserState, userStateName } from 'src/data/redux/user/state';
import { createSlice } from '@reduxjs/toolkit';
import {
  logoutReducer,
  setIsUserLoggedInReducer,
  setUserReducer,
} from 'src/data/redux/user/reducer';
import { createUser, login } from 'src/data/redux/user/action';

const initialState: UserState = {
  uid: null,
  isLoggedIn: false,
  photoUrl: null,
  name: null,
} as const;

const userSlice = createSlice({
  name: userStateName,
  initialState,
  reducers: {
    setUser: setUserReducer,
    setIsUserLoggedIn: setIsUserLoggedInReducer,
    logout: logoutReducer,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, { payload }) => ({
        ...state,
        isLoggedIn: payload.isLoggedIn,
      }))
      .addCase(createUser.fulfilled, (state, { payload }) => ({
        ...state,
        uid: payload.uid,
        name: payload.name,
        photoUrl: payload.photoUrl,
        isLoggedIn: true,
      }));
  },
});

export const {
  setUser,
  setIsUserLoggedIn,
  logout,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
