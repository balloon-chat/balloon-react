import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { topicStateName } from 'src/data/redux/topic/state';
import { Topic } from 'src/domain/topic/models/topic';
import { TopicService } from 'src/domain/topic/service/topicService';
import { TopicEntity, TopicEntityFactory } from 'src/view/types/topic';

export const CREATE_TOPIC = `${topicStateName}/create`;
export const FETCH_TOPIC = `${topicStateName}/fetch`;

export const createTopic = createAsyncThunk<Topic, {
  title: string, userId: string, description: string, thumbnail: File | Blob,
}>(
    CREATE_TOPIC,
    async ({ title, userId, description, thumbnail }) => {
      const service = new TopicService();
      return await service.createTopic(title, description, userId, thumbnail);
    },
);

export const fetchTopic = createAsyncThunk<TopicEntity | undefined, { topicId: string }>(
    FETCH_TOPIC,
    async ({ topicId }) => {
      const service = new TopicService();
      const topic = await service.fetchTopic(topicId);
      if (!topic) return;
      return TopicEntityFactory.create(topic);
    },
);

export type SetIsTopicCreated = PayloadAction<{ isTopicCreated: boolean }>;
export type SetTopicId = PayloadAction<{ topicId: string | null }>;
