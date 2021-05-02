import { Action, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { topicStateName } from 'src/data/redux/topic/state';
import { Topic } from 'src/domain/topic/models/topic';
import { TopicService } from 'src/domain/topic/service/topicService';
import { TopicEntity, TopicEntityFactory } from 'src/view/types/topic';

export const CREATE_TOPIC = `${topicStateName}/create`;
export const FETCH_TOPIC = `${topicStateName}/fetch_topic`;
export const FETCH_TOPICS = `${topicStateName}/fetch_topics`;
export const FETCH_TOPICS_CREATED_BY = `${topicStateName}/fetch_topics_created_by`;
const FETCH_TOPIC_BY_CODE = `${topicStateName}/fetch_by_code`;

export const createTopic = createAsyncThunk<
  Topic,
  {
    description: string;
    isPrivate: boolean,
    title: string;
    thumbnail: File | Blob;
    userId: string;
  }
>(CREATE_TOPIC, async ({ description, isPrivate, title, thumbnail, userId }) => {
  const service = new TopicService();
  return service.createTopic(title, description, userId, thumbnail, isPrivate);
});

export const fetchTopic = createAsyncThunk<
  TopicEntity | undefined,
  {
    topicId: string,
    // 閲覧ユーザーのID
    userId: string,
  }
>(FETCH_TOPIC, async ({ topicId }) => {
  const service = new TopicService();
  const topic = await service.fetchTopic(topicId);
  if (!topic) return undefined;
  return TopicEntityFactory.create(topic);
});

export const fetchTopicsFrom = createAsyncThunk<
  TopicEntity[],
  { from?: string }
>(FETCH_TOPICS, async ({ from }) => {
  const service = new TopicService();
  const topics = await service.fetchTopics(50, from);
  return topics.map((topic) => TopicEntityFactory.create(topic));
});

export const fetchTopicsCreatedBy = createAsyncThunk<
  {topics: TopicEntity[]},
  { createdBy: string, userId: string }
>(FETCH_TOPICS_CREATED_BY, async ({ createdBy, userId }) => {
  const service = new TopicService();
  const topics = await service.fetchTopicsCreatedBy(createdBy, userId);
  return { topics: topics.map((topic) => TopicEntityFactory.create(topic)) };
});

export const fetchTopicByCode = createAsyncThunk<
  {
    topicId: string | null
  },
  {
    code: number[] | string
  }
>(FETCH_TOPIC_BY_CODE, async ({ code }) => {
  const service = new TopicService();
  const topic = await service.fetchTopicFromCode(code);
  return {
    topicId: topic?.id.value ?? null,
  };
});

export type SetIsTopicCreated = PayloadAction<{ isTopicCreated: boolean }>;
export type SetTopicId = PayloadAction<{ topicId: string | null }>;
export type SetInvitationCode = PayloadAction<{ code: number[] | null}>
export type SetTopics = PayloadAction<{ topics: TopicEntity[] }>;
export type ResetTopicState = Action;
