import { createSlice } from '@reduxjs/toolkit';
import { sendMessage } from 'src/data/redux/message/action';
import {
  observeFulfilledReducer,
  observeStartReducer,
  resetMessagesReducer,
} from 'src/data/redux/message/reducer';
import { MessageState, messageStateName } from 'src/data/redux/message/state';

const initialState: MessageState = {
  messages: null,
};

const slice = createSlice({
  name: messageStateName,
  initialState,
  reducers: {
    observeStart: observeStartReducer,
    observeFulfilled: observeFulfilledReducer,
    resetMessages: resetMessagesReducer,
  },
  extraReducers: (builder) => {
    builder.addCase(sendMessage.fulfilled, (state) => state);
  },
});

export const messageReducer = slice.reducer;
export const { observeStart, observeFulfilled, resetMessages } = slice.actions;
