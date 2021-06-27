import { ChatState, chatStateName } from 'src/data/redux/chat/state';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ChatState = {
  dialog: {
    deriveTopicDialog: false,
    messageLog: false,
  },
  invitation: null,
  isEditable: false,
  notification: null,
};

/* eslint-disable no-param-reassign */
const slice = createSlice({
  name: chatStateName,
  initialState,
  reducers: {
    showDeriveTopicDialog: (state) => {
      state.dialog.deriveTopicDialog = true;
    },
    closeDerivedTopicDialog: (state) => {
      state.dialog.deriveTopicDialog = false;
    },
    showMessageLog: (state) => {
      state.dialog.messageLog = true;
    },
    closeMessageLog: (state) => {
      state.dialog.messageLog = false;
    },
    setInvitation: (state, { payload }: PayloadAction<{ invitation: string | null }>) => {
      state.invitation = payload.invitation;
    },
    updateIsEditable: (state, { payload }: PayloadAction<{ isEditable: boolean }>) => {
      state.isEditable = payload.isEditable;
    },
    resetChatState: (state) => {
      state.dialog = initialState.dialog;
      state.isEditable = initialState.isEditable;
      state.invitation = initialState.invitation;
      state.notification = initialState.notification;
    },
  },
});

export const chatReducer = slice.reducer;
export const {
  showDeriveTopicDialog,
  closeDerivedTopicDialog,
  showMessageLog,
  closeMessageLog,
  setInvitation,
  updateIsEditable,
  resetChatState,
} = slice.actions;
