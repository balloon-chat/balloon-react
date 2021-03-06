import { CaseReducer } from '@reduxjs/toolkit';
import { SetRoomId } from 'src/data/redux/room/action';
import { RoomState } from 'src/data/redux/room/state';

export const setRoomIdReducer: CaseReducer<RoomState, SetRoomId> = (state, { payload }) => ({
  ...state,
  roomId: payload.roomId,
}) as const;
