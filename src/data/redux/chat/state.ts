import { TopicEntity } from 'src/view/types/topic';

export const chatStateName = 'chatState';

export type ChatState = {
  branchTopicId: string | null,
  topicId: string | null,
  topic: TopicEntity | null,

  invitationCode: number[] | null,
  invitation: string | null,

  isEditable: boolean,

  notification: {
    type: ChatNotification,
    message: string,
  } | null,
  dialog: {
    deriveTopicDialog: boolean,
    derivedTopicsDialog: boolean,
    messageLog: boolean,
  }
}

export const ChatNotificationTypes = {
  // 単にメッセージだけを表示する
  SIMPLE_MESSAGE: 'SIMPLE_MESSAGE',

  // 話題が派生した
  DERIVED_TOPIC_CREATED: 'DERIVED_TOPIC_CREATED',
};

export type ChatNotification = typeof ChatNotificationTypes[keyof typeof ChatNotificationTypes];
