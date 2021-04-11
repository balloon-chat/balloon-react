import { CaseReducer } from '@reduxjs/toolkit';
import { LoginStates, UserState } from 'src/data/redux/user/state';
import { ResetUserState, SetUser } from 'src/data/redux/user/action';

export const setUserReducer: CaseReducer<UserState, SetUser> = (
  state,
  { payload },
) => ({
  ...state,
  uid: payload.uid,
  name: payload.name,
  photoUrl: payload.photoUrl,
} as const);

export const resetUserStateReducer: CaseReducer<
  UserState,
  ResetUserState
> = (state) => ({
  ...state,
  uid: null,
  name: null,
  photoUrl: null,
  loginState: LoginStates.NOT_LOGGED_IN,
});
