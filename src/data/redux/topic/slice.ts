import { createSlice } from '@reduxjs/toolkit';
import { TopicState, topicStateName, topicStates } from 'src/data/redux/topic/state';
import {
  resetTopicStateReducer,
  setCurrentTopicReducer,
  setInvitationCodeReducer,
  setTopicsReducer,
} from 'src/data/redux/topic/reducer';
import {
  createTopic,
  fetchTopic,
  fetchTopicByCode,
  fetchTopicsCreatedBy,
  fetchTopicsFrom,
  updateTopic,
} from 'src/data/redux/topic/action';
import { TopicEntity } from 'src/view/types/topic';

const initialState: TopicState = {
  topics: [] as TopicEntity[],
  code: null,
  isTopicCreated: false,
} as const;

const topicSlice = createSlice({
  name: topicStateName,
  initialState,
  reducers: {
    setInvitationCode: setInvitationCodeReducer,
    setCurrentTopic: setCurrentTopicReducer,
    setTopics: setTopicsReducer,
    resetTopicState: resetTopicStateReducer,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTopic.fulfilled, (state, { payload }) => ({
        ...state,
        currentTopic: payload.created,
        state: topicStates.TOPIC_CREATED,
      }))
      .addCase(createTopic.rejected, (state) => ({
        ...state,
        state: topicStates.CRETE_TOPIC_ERROR,
      }))
      .addCase(fetchTopic.fulfilled, (state, { payload }) => ({
        ...state,
        state: payload === undefined ? topicStates.NOT_FOUND : undefined,
        currentTopic: payload,
      }))
      .addCase(fetchTopicsFrom.fulfilled, (state, { payload }) => ({
        ...state,
        topics: [...state.topics, ...payload],
      }))
      .addCase(fetchTopicsCreatedBy.fulfilled, (state, { payload }) => ({
        ...state,
        topics: payload.topics,
      }))
      .addCase(fetchTopicByCode.rejected, (state) => ({
        ...state,
        state: topicStates.CANNOT_FIND_BY_CODE,
      }))
      .addCase(fetchTopicByCode.fulfilled, (state, { payload }) => ({
        ...state,
        topicId: payload.topicId,
        state: payload.topicId ? topicStates.TOPIC_FOUND : topicStates.CANNOT_FIND_BY_CODE,
      }))
      .addCase(updateTopic.rejected, (state) => ({
        ...state,
        state: topicStates.UPDATE_TOPIC_ERROR,
      }))
      .addCase(updateTopic.fulfilled, (state, { payload }) => ({
        ...state,
        topicId: payload.topicId,
        state: topicStates.TOPIC_UPDATED,
      }));
  },
});

export const {
  setInvitationCode,
  setCurrentTopic,
  setTopics,
  resetTopicState,
} = topicSlice.actions;
export const topicReducer = topicSlice.reducer;
