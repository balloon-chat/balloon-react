import { createAsyncThunk } from '@reduxjs/toolkit';
import { topicStateName } from 'src/data/redux/topic/state';
import { TopicService } from 'src/domain/topic/service/topicService';
import { TopicEntity, TopicEntityFactory } from 'src/view/types/topic';

const CREATE_TOPIC = `${topicStateName}/create`;
const DERIVE_TOPIC = `${topicStateName}/derive`;
const FETCH_TOPIC = `${topicStateName}/fetch_topic`;
const FETCH_TOPICS = `${topicStateName}/fetch_topics`;
const FETCH_TOPICS_CREATED_BY = `${topicStateName}/fetch_topics_created_by`;
const FETCH_TOPIC_BY_CODE = `${topicStateName}/fetch_by_code`;
const UPDATE_TOPIC = `${topicStateName}/update`;

export const createTopic = createAsyncThunk<
  {
    created: TopicEntity,
  },
  {
    description: string,
    isPrivate: boolean,
    title: string;
    thumbnail: File | Blob;
    userId: string;
  }
>(CREATE_TOPIC, async ({ description, isPrivate, title, thumbnail, userId }) => {
  const service = new TopicService();
  return {
    created: await service.createTopic(title, description, userId, thumbnail, isPrivate),
  };
});

export const updateTopic = createAsyncThunk<
  {
    topic: TopicEntity,
  },
  {
    topicId: string,
    title?: string,
    description?: string,
    thumbnail?: File|Blob,
    isPrivate?: boolean,
  }
>(UPDATE_TOPIC, async ({ topicId, title, description, thumbnail, isPrivate }) => {
  const service = new TopicService();
  const topic = await service.updateTopic(topicId, { title, description, thumbnail, isPrivate });
  return { topic };
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
  return service.fetchTopics(50, from);
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

export const deriveTopic = createAsyncThunk<
  { topic: TopicEntity },
  { topicId: string, title: string }
>(DERIVE_TOPIC, async ({ topicId, title }) => {
  const service = new TopicService();
  const topic = await service.deriveTopic(topicId, title);
  if (!topic) throw Error(`Topic(${topicId}) was not found`);

  return { topic };
});
