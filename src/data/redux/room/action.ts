import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { roomStateName } from 'src/data/redux/room/state';
import { Room } from 'src/domain/room/models/room';
import { RoomService } from 'src/domain/room/service/RoomService';
import { RoomEntity, RoomEntityFactory } from 'src/view/types/room';

export const CREATE_ROOM = `${roomStateName}/create`;
export const FETCH_ROOMS = `${roomStateName}/fetch_rooms`;
export const FETCH_ROOM = `${roomStateName}/fetch_room`;

export const createRoom = createAsyncThunk<Room, { title: string, userId: string, description: string }>(
    CREATE_ROOM,
    async ({ title, userId, description }) => {
      const service = new RoomService();
      return await service.createRoom(title, description, userId);
    },
);

export const fetchRooms = createAsyncThunk<RoomEntity[], {}>(
    FETCH_ROOMS,
    async ({}) => {
      const service = new RoomService();
      const rooms = await service.fetchRooms(50);
      return rooms.map((room) => RoomEntityFactory.create(room));
    },
);

export const fetchRoom = createAsyncThunk<RoomEntity | undefined, { roomId: string }>(
    FETCH_ROOM,
    async ({ roomId }) => {
      const service = new RoomService();
      const room = await service.fetchRoom(roomId);
      if (!room) return;
      return RoomEntityFactory.create(room);
    },
);

export type SetIsRoomCreated = PayloadAction<{ isRoomCreated: boolean }>;
export type SetRoomId = PayloadAction<{ roomId?: string }>;
