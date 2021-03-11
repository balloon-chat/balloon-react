import { createSlice } from '@reduxjs/toolkit';
import { TopicState, topicStateName, topicStates } from 'src/data/redux/topic/state';
import { setIsTopicCreatedReducer } from 'src/data/redux/topic/reducer';
import { createTopic, fetchTopic } from 'src/data/redux/topic/action';
import { TopicEntity } from 'src/view/types/topic';

const initialState: TopicState = {
  topics: [] as TopicEntity[],
  isTopicCreated: false,
} as const;

const topicSlice = createSlice({
  name: topicStateName,
  initialState,
  reducers: {
    setIsTopicCreated: setIsTopicCreatedReducer,
  },
  extraReducers: builder => {
    builder
        .addCase(createTopic.fulfilled, (state, { payload }) => ({
          ...state,
          topicId: payload.id.value,
          isTopicCreated: true,
        }))
        .addCase(fetchTopic.fulfilled, (state, { payload }) => ({
          ...state,
          state: payload === undefined ? topicStates.NotFound : undefined,
          currentTopic: payload,
        }));
  },
});

export const { setIsTopicCreated } = topicSlice.actions;
export const topicReducer = topicSlice.reducer;
