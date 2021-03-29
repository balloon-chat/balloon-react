import { UserState, userStateName } from 'src/data/redux/user/state';
import { createSlice } from '@reduxjs/toolkit';
import {
  logoutReducer,
  setIsUserLoggedInReducer,
  setUserReducer,
} from 'src/data/redux/user/reducer';

const initialState: UserState = {
  uid: null,
  isLoggedIn: false,
  photoUrl: null,
  name: null,
};

const userSlice = createSlice({
  name: userStateName,
  initialState,
  reducers: {
    setUser: setUserReducer,
    setIsUserLoggedIn: setIsUserLoggedInReducer,
    logout: logoutReducer,
  },
} as const);

export const {
  setUser,
  setIsUserLoggedIn,
  logout,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
