import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ReduxRoomEntity, roomStateName } from 'src/data/redux/room/state';
import { Room } from 'src/domain/room/models/room';
import { RoomService } from 'src/domain/room/service/RoomService';

export const CREATE_ROOM = `${roomStateName}/create`;
export const FETCH_ROOMS = `${roomStateName}/fetch`;

export const createRoom = createAsyncThunk<Room, { title: string, userId: string, description: string }>(
    CREATE_ROOM,
    async ({ title, userId, description }) => {
      const service = new RoomService();
      return await service.createRoom(title, description, userId);
    },
);

export const fetchRooms = createAsyncThunk<ReduxRoomEntity[], {}>(
    FETCH_ROOMS,
    async ({}) => {
      const service = new RoomService();
      const rooms = await service.fetchRooms();
      return rooms.map((room): ReduxRoomEntity => ({
        id: room.id.value,
        title: room.title.value,
        description: room.description?.value,
        createdAt: room.createdAt,
        thumbnailUrl: room.thumbnailUrl,
        commentCount: room.commentCount,
      } as const));
    },
);

export type SetIsRoomCreated = PayloadAction<{ isRoomCreated: boolean }>;
export type SetRoomId = PayloadAction<{ roomId?: string }>;
