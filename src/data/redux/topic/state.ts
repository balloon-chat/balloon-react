import { TopicEntity } from 'src/view/types/topic';

export const topicStateName = 'topicState';

export type TopicState = {
  currentTopic?: TopicEntity,
  topicId?: string,
  topics: TopicEntity[],
  pickup?: TopicEntity
  isTopicCreated: boolean,
  state?: TopicStates,
};

export const topicStates = {
  NotFound: 'NOT_FOUND',
} as const;

type TopicStates = typeof topicStates[keyof typeof topicStates];
