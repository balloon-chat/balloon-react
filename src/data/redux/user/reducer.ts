import { CaseReducer } from '@reduxjs/toolkit';
import { UserState } from 'src/data/redux/user/state';
import { SetUser, SetUserActionState } from 'src/data/redux/user/action';

export const setUserReducer: CaseReducer<UserState, SetUser> = (
  state,
  { payload },
) => ({
  ...state,
  uid: payload.uid,
  name: payload.name,
  photoUrl: payload.photoUrl,
} as const);

export const setUserActionStateReducer: CaseReducer<UserState, SetUserActionState> = (
  state,
  { payload },
) => ({
  ...state,
  state: payload,
});
