import { LoginStates, UserActionStates, UserState, userStateName } from 'src/data/redux/user/state';
import { createSlice } from '@reduxjs/toolkit';
import { setUserActionStateReducer, setUserReducer } from 'src/data/redux/user/reducer';
import { createUser, login, updateProfile } from 'src/data/redux/user/action';

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
    setUser: setUserReducer,
    setUserActionState: setUserActionStateReducer,
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
