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
    title: string,
    message?: string,
    payload: ChatNotificationPayload,
  } | null,
  dialog: {
    deriveTopicDialog: boolean,
    branchTopicDialog: boolean,
    messageLog: boolean,
  }
}

export const ChatNotificationTypes = {
  // 単にメッセージだけを表示する
  SIMPLE_MESSAGE: 'SIMPLE_MESSAGE',

  // 招待
  INVITATION: 'INVITATION',

  // 話題が派生した
  BRANCH_TOPIC_CREATED: 'BRANCH_TOPIC_CREATED',
};
export type ChatNotification = typeof ChatNotificationTypes[keyof typeof ChatNotificationTypes];

export type BranchTopicCreatedPayload = { title: string, branch: number }
export type ChatNotificationPayload = BranchTopicCreatedPayload | {}
