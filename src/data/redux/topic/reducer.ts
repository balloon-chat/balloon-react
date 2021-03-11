import { CaseReducer } from '@reduxjs/toolkit';
import { SetIsTopicCreated } from 'src/data/redux/topic/action';
import { TopicState } from 'src/data/redux/topic/state';

export const setIsTopicCreatedReducer: CaseReducer<TopicState, SetIsTopicCreated> = (state, { payload }) => ({
  ...state,
  isTopicCreated: payload.isTopicCreated,
} as const);
