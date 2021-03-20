import { CaseReducer } from '@reduxjs/toolkit';
import { SetIsTopicCreated, SetTopicId, SetTopics } from 'src/data/redux/topic/action';
import { TopicState } from 'src/data/redux/topic/state';

export const setIsTopicCreatedReducer: CaseReducer<TopicState, SetIsTopicCreated> = (state, { payload }) => ({
  ...state,
  isTopicCreated: payload.isTopicCreated,
} as const);

export const setTopicIdReducer: CaseReducer<TopicState, SetTopicId> = (state, { payload }) => ({
  ...state,
  topicId: payload.topicId,
} as const);

export const setTopicsReducer: CaseReducer<TopicState, SetTopics> = (state, { payload }) => ({
  ...state,
  topics: payload.topics,
});
