import { UserState, userStateName } from 'src/data/redux/user/state';
import { createSlice } from '@reduxjs/toolkit';
import { setUserIdReducer } from 'src/data/redux/user/reducer';

const initialState: UserState = {
  uid: null,
};

const userSlice = createSlice({
  name: userStateName,
  initialState,
  reducers: {
    setUserId: setUserIdReducer,
  },
} as const);

export const {
  setUserId,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
