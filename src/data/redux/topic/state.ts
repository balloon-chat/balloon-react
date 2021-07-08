import { TopicEntity } from 'src/view/types/topic';

export const topicStateName = 'topicState';

export type TopicStateType = {
  topics: TopicEntity[],
  pickup?: TopicEntity,

  state?: TopicState,

  edit: {
    mode: EditTopicMode,
    state: EditTopicState | null,
    update: {
      topic: TopicEntity,
    } | null;
    create: {
      created: TopicEntity | null,
    } | null,
  } | null,
};

export const TopicStates = {
  NOT_FOUND: 'NOT_FOUND',
  TOPIC_FOUND: 'TOPIC_FOUND',
  CANNOT_FIND_BY_CODE: 'CANNOT_FIND_BY_CODE',
} as const;
type TopicState = typeof TopicStates[keyof typeof TopicStates];

export const EditTopicModes = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
} as const;
export type EditTopicMode = typeof EditTopicModes[keyof typeof EditTopicModes];

export const EditTopicStates = {
  CREATED: 'CREATED',
  UPDATED: 'UPDATED',
  UPDATE_TOPIC_ERROR: 'UPDATE_TOPIC_ERROR',
  CREATE_TOPIC_ERROR: 'CREATE_TOPIC_ERROR',
} as const;
type EditTopicState = typeof EditTopicStates[keyof typeof EditTopicStates];
