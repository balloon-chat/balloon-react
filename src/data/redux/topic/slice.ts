import { createSlice } from '@reduxjs/toolkit';
import { TopicState, topicStateName, topicStates } from 'src/data/redux/topic/state';
import {
  setInvitationCodeReducer,
  setIsTopicCreatedReducer,
  setTopicIdReducer,
  setTopicsReducer,
} from 'src/data/redux/topic/reducer';
import {
  createTopic,
  fetchTopic,
  fetchTopicsCreatedBy,
  fetchTopicsFrom,
} from 'src/data/redux/topic/action';
import { TopicEntity } from 'src/view/types/topic';

const initialState: TopicState = {
  topics: [] as TopicEntity[],
  topicId: null,
  code: null,
  isTopicCreated: false,
} as const;

const topicSlice = createSlice({
  name: topicStateName,
  initialState,
  reducers: {
    setIsTopicCreated: setIsTopicCreatedReducer,
    setInvitationCode: setInvitationCodeReducer,
    setTopicId: setTopicIdReducer,
    setTopics: setTopicsReducer,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTopic.fulfilled, (state, { payload }) => ({
        ...state,
        topicId: payload.id.value,
        isTopicCreated: true,
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
      }));
  },
});

export const { setIsTopicCreated, setInvitationCode, setTopicId, setTopics } = topicSlice.actions;
export const topicReducer = topicSlice.reducer;
