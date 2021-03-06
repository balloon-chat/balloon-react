export const messageStateName = 'roomState';

export type ReduxMessageEntity = {
  id: string,
  message: string,
  sender?: string,
  createdAt: number,
};

export type MessageState = {
  messages: ReduxMessageEntity[],
};
