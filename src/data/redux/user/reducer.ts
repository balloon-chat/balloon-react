import { CaseReducer } from '@reduxjs/toolkit';
import { UserState } from 'src/data/redux/user/state';
import { SetUserId } from 'src/data/redux/user/action';

export const setUserIdReducer: CaseReducer<UserState, SetUserId> = (state, { payload }) => ({
  ...state,
  uid: payload,
} as const);
