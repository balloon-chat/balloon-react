import { UserState, userStateName } from 'src/data/redux/user/state';
import { createSlice } from '@reduxjs/toolkit';
import { setIsUserLoggedInReducer, setPhotoUrlReducer, setUserIdReducer } from 'src/data/redux/user/reducer';

const initialState: UserState = {
  uid: null,
  isLoggedIn: false,
  photoUrl: null,
};

const userSlice = createSlice({
  name: userStateName,
  initialState,
  reducers: {
    setUserId: setUserIdReducer,
    setPhotoUrl: setPhotoUrlReducer,
    setIsUserLoggedIn: setIsUserLoggedInReducer,
  },
} as const);

export const {
  setUserId,
  setIsUserLoggedIn,
  setPhotoUrl,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
