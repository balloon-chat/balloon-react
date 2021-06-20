import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MessageService } from 'src/domain/message/service/MessageService';
import { messageStateName } from 'src/data/redux/message/state';
import { MessageEntity } from 'src/view/types/message';

export const SEND_MESSAGE = `${messageStateName}/send`;

export const sendMessage = createAsyncThunk<
  void,
  { message: string; userId: string; topicId: string }
>(SEND_MESSAGE, async ({ message, userId, topicId }) => {
  const service = new MessageService();
  await service.sendMessage(message, userId, topicId);
});

export type ResetMessages = PayloadAction<{}>;
export type ObserveStart = PayloadAction<{ topicId: string }>;
export type ObserveFulfilled = PayloadAction<{
  topicId: string;
  messages: MessageEntity[];
}>;
export type MessageActions = ObserveStart | ObserveFulfilled;
