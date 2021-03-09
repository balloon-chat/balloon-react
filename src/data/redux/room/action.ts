import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { roomStateName } from 'src/data/redux/room/state';
import { Room } from 'src/domain/room/models/room';
import { RoomService } from 'src/domain/room/service/RoomService';

export const CREATE_ROOM = `${roomStateName}/create`;

export const createRoom = createAsyncThunk<Room, { title: string, userId: string, description: string }>(
    CREATE_ROOM,
    async ({ title, userId, description }) => {
      const service = new RoomService();
      return await service.createRoom(title, description, userId);
    },
);

export type SetIsRoomCreated = PayloadAction<{ isRoomCreated: boolean }>;
export type SetRoomId = PayloadAction<{ roomId?: string }>;
