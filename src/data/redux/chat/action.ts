import { PayloadAction } from '@reduxjs/toolkit';
import { TopicEntity } from 'src/view/types/topic';

export type ObserveTopic = PayloadAction<{ topicId: string }>;
export type ObserveTopicFulfilled = PayloadAction<{ topicId: string, topic: TopicEntity | null }>;
export type ChatActions = ObserveTopic | ObserveTopicFulfilled;
