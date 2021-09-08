import { ChatState, chatStateName } from 'src/data/redux/chat/state';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TopicEntity } from 'src/view/types/topic';
import { ObserveTopic, ObserveTopicFulfilled, ShowNotification } from 'src/data/redux/chat/action';

const initialState: ChatState = {
  topic: null,
  topicId: null,
  branchTopicId: null,
  dialog: {
    deriveTopicDialog: false,
    branchTopicDialog: false,
    messageLog: false,
    detailAction: false,
  },
  invitation: null,
  invitationCode: null,
  isEditable: false,
  notification: null,
};

/* eslint-disable no-param-reassign */
const slice = createSlice({
  name: chatStateName,
  initialState,
  reducers: {
    showDeriveTopicDialog: (state) => { state.dialog.deriveTopicDialog = true; },
    closeDeriveTopicDialog: (state) => { state.dialog.deriveTopicDialog = false; },

    showBranchTopicsDialog: (state) => { state.dialog.branchTopicDialog = true; },
    closeBranchTopicsDialog: (state) => { state.dialog.branchTopicDialog = false; },

    showMessageLog: (state) => { state.dialog.messageLog = true; },
    closeMessageLog: (state) => { state.dialog.messageLog = false; },

    showDetailActionDialog: (state) => { state.dialog.detailAction = true; },
    closeDetailActionDialog: (state) => { state.dialog.detailAction = false; },

    notify: (state, { payload }: ShowNotification) => {
      state.notification = {
        type: payload.type,
        title: payload.title,
        message: payload.message ?? undefined,
        payload: payload.payload,
      };
    },
    clearNotification: (state) => { state.notification = null; },
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
      } else if (index < topic.branchTopics.length) {
        state.branchTopicId = topic.branchTopics[index].id;
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
    observeTopic: (state, { payload }: ObserveTopic) => {
      state.topicId = payload.topicId;
    },
    observeTopicFulfilled: (state, { payload }: ObserveTopicFulfilled) => {
      if (!payload.topic) return;
      state.topic = payload.topic;
    },
  },
});

export const chatReducer = slice.reducer;
export const {
  setTopic,
  setBranch,

  showDeriveTopicDialog,
  closeDeriveTopicDialog,

  showBranchTopicsDialog,
  closeBranchTopicsDialog,

  showMessageLog,
  closeMessageLog,

  showDetailActionDialog,
  closeDetailActionDialog,

  notify,
  clearNotification,

  setInvitation,
  setInvitationCode,

  updateIsEditable,

  resetChatState,

  observeTopic,
  observeTopicFulfilled,
} = slice.actions;
