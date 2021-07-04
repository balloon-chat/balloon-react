import { ChatNotification, ChatState, chatStateName } from 'src/data/redux/chat/state';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TopicEntity } from 'src/view/types/topic';

const initialState: ChatState = {
  topic: null,
  topicId: null,
  branchTopicId: null,
  dialog: {
    deriveTopicDialog: false,
    derivedTopicsDialog: false,
    messageLog: false,
  },
  invitation: null,
  invitationCode: null,
  isEditable: false,
  notification: null,
};

type ShowNotification = PayloadAction<{type: ChatNotification, message: string }>;

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
    showDerivedTopicsDialog: (state) => {
      state.dialog.derivedTopicsDialog = true;
    },
    closeDerivedTopicsDialog: (state) => {
      state.dialog.derivedTopicsDialog = false;
    },
    showMessageLog: (state) => {
      state.dialog.messageLog = true;
    },
    closeMessageLog: (state) => {
      state.dialog.messageLog = false;
    },
    notify: (state, { payload }: ShowNotification) => {
      state.notification = {
        type: payload.type,
        message: payload.message,
      };
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    setTopic: (state, { payload }: PayloadAction<{topic: TopicEntity | null}>) => {
      state.topicId = payload.topic?.id ?? null;
      state.topic = payload.topic;
    },
    setBranch: (state, { payload }: PayloadAction<{index: number| null}>) => {
      const { index } = payload;
      const { topic } = state;
      if (!topic) return;

      if (index === null) {
        state.branchTopicId = null;
      } else if (index < topic.derivedTopics.length) {
        state.branchTopicId = topic.derivedTopics[index].id;
      }
    },
    setInvitationCode: (state, { payload }: PayloadAction<{ code: number[] | null}>) => {
      state.invitationCode = payload.code;
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
  setTopic,
  setBranch,

  showDeriveTopicDialog,
  showDerivedTopicsDialog,
  showMessageLog,
  closeDerivedTopicDialog,
  closeDerivedTopicsDialog,
  closeMessageLog,

  notify,
  clearNotification,

  setInvitation,
  setInvitationCode,

  updateIsEditable,

  resetChatState,
} = slice.actions;
