import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MessageService } from 'src/domain/message/service/MessageService';
import { messageStateName, ReduxMessageEntity } from 'src/data/redux/message/state';

export const SEND_MESSAGE = `${messageStateName}/send`;

export const sendMessage = createAsyncThunk<void, { message: string, userId: string, roomId: string }>(
    SEND_MESSAGE,
    async ({ message, userId, roomId }) => {
      const service = new MessageService();
      await service.sendMessage(message, userId, roomId);
    },
);

export type ObserveStart = PayloadAction<{ roomId: string }>;
export type ObserveFulfilled = PayloadAction<{ roomId: string, messages: ReduxMessageEntity[] }>;
export type MessageActions = ObserveStart | ObserveFulfilled;
