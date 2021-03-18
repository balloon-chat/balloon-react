import { CaseReducer } from '@reduxjs/toolkit';
import { UserState } from 'src/data/redux/user/state';
import { SetIsUserLoggedIn, SetUserId } from 'src/data/redux/user/action';

export const setUserIdReducer: CaseReducer<UserState, SetUserId> = (state, { payload }) => ({
  ...state,
  uid: payload,
} as const);

export const setIsUserLoggedInReducer: CaseReducer<UserState, SetIsUserLoggedIn> = (state, { payload }) => ({
  ...state,
  isLoggedIn: payload,
});
