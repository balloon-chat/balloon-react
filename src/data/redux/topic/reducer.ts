import { CaseReducer } from '@reduxjs/toolkit';
import {
  ResetTopicState,
  SetCurrentTopic,
  SetInvitationCode,
  SetIsTopicCreated,
  SetTopicId,
  SetTopics,
} from 'src/data/redux/topic/action';
import { TopicState } from 'src/data/redux/topic/state';

export const setIsTopicCreatedReducer: CaseReducer<
  TopicState,
  SetIsTopicCreated
> = (state, { payload }) => ({
  ...state,
  isTopicCreated: payload.isTopicCreated,
} as const);

export const resetTopicStateReducer: CaseReducer<TopicState, ResetTopicState> = (
  state,
) => ({
  ...state,
  state: undefined,
});

export const setTopicIdReducer: CaseReducer<TopicState, SetTopicId> = (
  state,
  { payload },
) => ({
  ...state,
  topicId: payload.topicId,
} as const);

export const setCurrentTopicReducer: CaseReducer<TopicState, SetCurrentTopic> = (
  state,
  { payload },
) => ({
  ...state,
  currentTopic: payload.topic ?? undefined,
});

export const setTopicsReducer: CaseReducer<TopicState, SetTopics> = (
  state,
  { payload },
) => ({
  ...state,
  topics: payload.topics,
});

export const setInvitationCodeReducer: CaseReducer<TopicState, SetInvitationCode> = (
  state,
  { payload },
) => ({
  ...state,
  code: payload.code,
});
