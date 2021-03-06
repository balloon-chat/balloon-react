import { CaseReducer, createSlice } from '@reduxjs/toolkit';
import { ObserveFulfilled, ObserveStart, sendMessage } from 'src/data/redux/message/actions';

export type ReduxMessageEntity = {
  id: string,
  message: string,
  sender?: string,
  createdAt: number,
};

export type MessageState = {
  roomId: string,
  messages: ReduxMessageEntity[],
};

const observeStartReducer: CaseReducer<MessageState, ObserveStart> = (state) => ({
  ...state,
});

const observeFulfilledReducer: CaseReducer<MessageState, ObserveFulfilled> = (state, { payload }) => ({
  ...state,
  messages: payload.messages,
});

const slice = createSlice({
  name: 'message',
  initialState: {
    roomId: 'abc',
    messages: [],
  } as MessageState,
  reducers: {
    observeStart: observeStartReducer,
    observeFulfilled: observeFulfilledReducer,
  },
  extraReducers: builder => {
    builder
      .addCase(sendMessage.fulfilled, (state) => state);
  },
});

export const messageReducer = slice.reducer;
export const observeStart = slice.actions.observeStart;
export const observeFulfilled = slice.actions.observeFulfilled;
