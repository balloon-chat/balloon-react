import { CaseReducer } from '@reduxjs/toolkit';
import { UserState } from 'src/data/redux/user/state';
import { Logout, SetIsUserLoggedIn, SetUser } from 'src/data/redux/user/action';

export const setUserReducer: CaseReducer<UserState, SetUser> = (
  state,
  { payload },
) => ({
  ...state,
  uid: payload.uid,
  name: payload.name,
  photoUrl: payload.photoUrl,
} as const);

export const setIsUserLoggedInReducer: CaseReducer<UserState,
  SetIsUserLoggedIn> = (state, { payload }) => ({
    ...state,
    isLoggedIn: payload,
  });

export const logoutReducer: CaseReducer<UserState, Logout> = (
  state,
  _,
) => ({
  ...state,
  uid: null,
  name: null,
  photoUrl: null,
  isLoggedIn: false,
});
