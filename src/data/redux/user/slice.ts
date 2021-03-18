import { UserState, userStateName } from 'src/data/redux/user/state';
import { createSlice } from '@reduxjs/toolkit';
import { setIsUserLoggedInReducer, setUserIdReducer } from 'src/data/redux/user/reducer';

const initialState: UserState = {
  uid: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: userStateName,
  initialState,
  reducers: {
    setUserId: setUserIdReducer,
    setIsUserLoggedIn: setIsUserLoggedInReducer,
  },
} as const);

export const {
  setUserId,
  setIsUserLoggedIn,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
