import { TopicEntity } from 'src/view/types/topic';

export const topicStateName = 'topicState';

export type TopicState = {
  currentTopic?: TopicEntity;
  topicId: string | null,
  code: number[] | null,
  topics: TopicEntity[],
  pickup?: TopicEntity,
  isTopicCreated: boolean,
  state?: TopicStates,
};

export const topicStates = {
  NOT_FOUND: 'NOT_FOUND',
  TOPIC_CREATED: 'TOPIC_CREATED',
  CRETE_TOPIC_ERROR: 'CRETE_TOPIC_ERROR',
  CANNOT_FIND_BY_CODE: 'CANNOT_FIND_BY_CODE',
  TOPIC_FOUND: 'TOPIC_FOUND',
  TOPIC_UPDATED: 'TOPIC_UPDATED',
  UPDATE_TOPIC_ERROR: 'UPDATE_TOPIC_ERROR',
} as const;

type TopicStates = typeof topicStates[keyof typeof topicStates];
