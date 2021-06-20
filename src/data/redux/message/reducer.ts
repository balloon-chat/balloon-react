import { CaseReducer } from '@reduxjs/toolkit';
import { ObserveFulfilled, ObserveStart, ResetMessages } from 'src/data/redux/message/action';
import { MessageState } from 'src/data/redux/message/state';

export const observeStartReducer: CaseReducer<MessageState, ObserveStart> = (
  state,
) => ({
  ...state,
} as const);

export const observeFulfilledReducer: CaseReducer<
  MessageState,
  ObserveFulfilled
> = (state, { payload }) => ({
  ...state,
  messages: payload.messages,
} as const);

export const resetMessagesReducer: CaseReducer<
  MessageState,
  ResetMessages
> = (state) => ({
  ...state,
  messages: null,
} as const);
