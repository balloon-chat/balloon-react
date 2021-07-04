import { createSlice } from '@reduxjs/toolkit';
import {
  EditTopicModes,
  EditTopicStates,
  topicStateName,
  TopicStates,
  TopicStateType,
} from 'src/data/redux/topic/state';
import {
  editTopicReducer,
  finishEditTopicReducer,
  setTopicsReducer,
} from 'src/data/redux/topic/reducer';
import {
  createTopic,
  deriveTopic,
  fetchTopic,
  fetchTopicByCode,
  fetchTopicsCreatedBy,
  fetchTopicsFrom,
  updateTopic,
} from 'src/data/redux/topic/action';
import { TopicEntity } from 'src/view/types/topic';

const initialState: TopicStateType = {
  edit: null,
  topics: [] as TopicEntity[],
} as const;

const topicSlice = createSlice({
  name: topicStateName,
  initialState,
  reducers: {
    editTopic: editTopicReducer,
    finishEditTopic: finishEditTopicReducer,
    setTopics: setTopicsReducer,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTopic.fulfilled, (state, { payload }) => ({
        ...state,
        edit: {
          mode: EditTopicModes.CREATE,
          state: EditTopicStates.CREATED,
          update: null,
          create: { created: payload.created },
        },
      }))
      .addCase(createTopic.rejected, (state) => ({
        ...state,
        edit: {
          mode: EditTopicModes.CREATE,
          state: EditTopicStates.CREATE_TOPIC_ERROR,
          update: null,
          create: null,
        },
      }))
      .addCase(deriveTopic.fulfilled, (state, { payload }) => ({
        ...state,
        currentTopic: payload.topic,
      }))
      .addCase(fetchTopic.fulfilled, (state, { payload }) => ({
        ...state,
        state: payload === undefined ? TopicStates.NOT_FOUND : undefined,
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
        state: TopicStates.CANNOT_FIND_BY_CODE,
      }))
      .addCase(fetchTopicByCode.fulfilled, (state, { payload }) => ({
        ...state,
        topicId: payload.topicId,
        state: payload.topicId ? TopicStates.TOPIC_FOUND : TopicStates.CANNOT_FIND_BY_CODE,
      }))
      .addCase(updateTopic.fulfilled, (state, { payload }) => ({
        ...state,
        edit: {
          mode: EditTopicModes.UPDATE,
          state: EditTopicStates.UPDATED,
          update: { topic: payload.topic },
          create: null,
        },
      }))
      .addCase(updateTopic.rejected, (state) => ({
        ...state,
        edit: {
          mode: EditTopicModes.CREATE,
          state: EditTopicStates.UPDATE_TOPIC_ERROR,
          update: null,
          create: null,
        },
      }));
  },
});

export const {
  editTopic,
  finishEditTopic,
  setTopics,
} = topicSlice.actions;

export const topicReducer = topicSlice.reducer;
