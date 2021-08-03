/* eslint-disable no-param-reassign */
import {
  LoginStates,
  UserActionState,
  UserActionStates,
  UserState,
  userStateName,
} from 'src/data/redux/user/state';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createUser, login, logout, SetUser, updateProfile } from 'src/data/redux/user/action';

const initialState: UserState = {
  uid: null,
  loginState: LoginStates.NOT_LOGGED_IN,
  state: null,
  photoUrl: null,
  name: null,
} as const;

const userSlice = createSlice({
  name: userStateName,
  initialState,
  reducers: {
    setUser: (state, { payload }: SetUser) => {
      state.uid = payload.uid;
      state.name = payload.name;
      state.photoUrl = payload.photoUrl;
      state.loginState = (payload.uid !== null && payload.name !== null && payload.photoUrl)
        ? LoginStates.LOGGED_IN
        : LoginStates.NOT_LOGGED_IN;
    },
    setUserActionState: (state, { payload }: PayloadAction<{state: UserActionState|null}>) => {
      state.state = payload.state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => ({
        ...state,
        loginState: LoginStates.FINDING,
      }))
      .addCase(login.rejected, (state) => ({
        ...state,
        loginState: LoginStates.LOGIN_ERROR,
      }))
      .addCase(login.fulfilled, (state, { payload }) => ({
        ...state,
        ...payload.user,
        loginState: payload.user != null ? LoginStates.LOGGED_IN : LoginStates.USER_NOT_FOUND,
      }))
      .addCase(logout.fulfilled, (state) => ({
        ...state,
        uid: null,
        name: null,
        photoUrl: null,
        loginState: LoginStates.NOT_LOGGED_IN,
      }))
      .addCase(createUser.pending, (state) => ({
        ...state,
        loginState: LoginStates.CREATING,
      }))
      .addCase(createUser.fulfilled, (state, { payload }) => ({
        ...state,
        uid: payload.uid,
        name: payload.name,
        photoUrl: payload.photoUrl,
        loginState: LoginStates.LOGGED_IN,
      }))
      .addCase(updateProfile.pending, (state) => ({
        ...state,
        state: UserActionStates.PROFILE_UPDATING,
      }))
      .addCase(updateProfile.rejected, (state) => ({
        ...state,
        state: UserActionStates.PROFILE_UPDATE_ERROR,
      }))
      .addCase(updateProfile.fulfilled, (state, { payload }) => ({
        ...state,
        name: payload.user.name,
        photoUrl: payload.user.photoUrl,
        state: UserActionStates.PROFILE_UPDATED,
      }));
  },
});

export const {
  setUser,
  setUserActionState,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
