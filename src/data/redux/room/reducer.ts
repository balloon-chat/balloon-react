import { CaseReducer } from '@reduxjs/toolkit';
import { SetIsRoomCreated, SetRoomId } from 'src/data/redux/room/action';
import { RoomState } from 'src/data/redux/room/state';

export const setIsRoomCreatedReducer: CaseReducer<RoomState, SetIsRoomCreated> = (state, { payload }) => ({
  ...state,
  isRoomCreated: payload.isRoomCreated,
} as const);

export const setRoomIdReducer: CaseReducer<RoomState, SetRoomId> = (state, { payload }) => ({
  ...state,
  roomId: payload.roomId,
}) as const;
