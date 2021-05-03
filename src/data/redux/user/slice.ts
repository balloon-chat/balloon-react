import { LoginStates, UserState, userStateName } from 'src/data/redux/user/state';
import { createSlice } from '@reduxjs/toolkit';
import { setUserReducer } from 'src/data/redux/user/reducer';
import { createUser, login, logout } from 'src/data/redux/user/action';

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
      .addCase(logout.rejected, (state) => ({
        ...state,
        loginState: LoginStates.LOGOUT_ERROR,
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
      }));
  },
});

export const {
  setUser,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
