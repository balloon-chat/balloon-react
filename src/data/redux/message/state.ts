import { MessageEntity } from 'src/view/types/message';

export const messageStateName = 'messageState';

export type MessageState = {
  messages: MessageEntity[] | null;
};
