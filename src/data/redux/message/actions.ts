import { Action, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MessageService } from 'src/domain/message/service/MessageService';
import { ReduxMessageEntity } from 'src/data/redux/message/slice';

export const SEND_MESSAGE = 'message/send';
export const sendMessage = createAsyncThunk<void, { message: string, userId: string, roomId: string }>(
    SEND_MESSAGE,
    async ({ message, userId, roomId }) => {
      const service = new MessageService();
      await service.sendMessage(message, userId, roomId);
    },
);

export type ObserveStart = Action;
export type ObserveFulfilled = PayloadAction<{ messages: ReduxMessageEntity[] }>;
export type MessageActions = ObserveStart | ObserveFulfilled;
