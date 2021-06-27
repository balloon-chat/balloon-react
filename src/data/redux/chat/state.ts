export const chatStateName = 'chatState';

export type ChatState = {
  invitation: string | null,
  isEditable: boolean,
  notification: string | null,
  dialog: {
    deriveTopicDialog: boolean,
    messageLog: boolean,
  }
}
