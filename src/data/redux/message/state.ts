export const messageStateName = 'messageState';

export type ReduxMessageEntity = {
  id: string,
  message: string,
  sender?: string,
  createdAt: number,
};

export type MessageState = {
  messages: ReduxMessageEntity[],
};
