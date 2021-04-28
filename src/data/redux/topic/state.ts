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
  CRETE_TOPIC_ERROR: 'CRETE_TOPIC_ERROR',
} as const;

type TopicStates = typeof topicStates[keyof typeof topicStates];
