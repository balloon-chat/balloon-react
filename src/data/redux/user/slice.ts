import { LoginStates, UserState, userStateName } from 'src/data/redux/user/state';
import { createSlice } from '@reduxjs/toolkit';
import {
  logoutReducer,
  setIsUserLoggedInReducer,
  setUserReducer,
} from 'src/data/redux/user/reducer';
import { createUser, login } from 'src/data/redux/user/action';

const initialState: UserState = {
  uid: null,
  loginState: LoginStates.NOT_LOGGED_IN,
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
      .addCase(login.pending, (state) => ({
        ...state,
        loginState: LoginStates.FINDING,
      }))
      .addCase(login.fulfilled, (state, { payload }) => ({
        ...state,
        loginState: payload.userFound ? LoginStates.LOGGED_IN : LoginStates.USER_NOF_FOUND,
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
      }));
  },
});

export const {
  setUser,
  setIsUserLoggedIn,
  logout,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
