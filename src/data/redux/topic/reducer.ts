import { Action, CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { EditTopicMode, EditTopicModes, TopicStateType } from 'src/data/redux/topic/state';
import { TopicEntity } from 'src/view/types/topic';

export const editTopicReducer: CaseReducer<
  TopicStateType,
  PayloadAction<{mode: EditTopicMode, topic: TopicEntity | null }>
> = (
  state, { payload },
) => ({
  ...state,
  edit: {
    state: null,
    mode: payload.mode,
    update: payload.mode === EditTopicModes.UPDATE && payload.topic
      ? {
        topic: payload.topic,
      }
      : null,
    create: null,
  },
});

export const finishEditTopicReducer: CaseReducer<
  TopicStateType,
  Action
> = (state) => ({
  ...state,
  edit: null,
});

export const setTopicsReducer: CaseReducer<
  TopicStateType,
  PayloadAction<{ topics: TopicEntity[] }>
> = (state, { payload }) => ({
  ...state,
  topics: payload.topics,
});
