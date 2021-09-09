import { PayloadAction } from '@reduxjs/toolkit';
import { TopicEntity } from 'src/view/types/topic';
import { ChatNotification, ChatNotificationPayload } from 'src/data/redux/chat/state';

export type ObserveTopic = PayloadAction<{ topicId: string }>;
export type ObserveTopicFulfilled = PayloadAction<{ topicId: string, topic: TopicEntity | null }>;
export type ChatActions = ObserveTopic | ObserveTopicFulfilled;

/*
 * Notification
 */
export type ShowNotification = PayloadAction<{
  type: ChatNotification,
  title: string,
  message: string | null,
  payload: ChatNotificationPayload,
}>;

/*
 Form
 */
export type SetIsInputting = PayloadAction<{
  value: boolean,
}>;
