import { createSlice } from '@reduxjs/toolkit';
import { RoomState, roomStateName } from 'src/data/redux/room/state';
import { setRoomIdReducer } from 'src/data/redux/room/reducer';

const initialState: RoomState = {
  roomId: undefined,
} as const;

const roomSlice = createSlice({
  name: roomStateName,
  initialState,
  reducers: {
    setRoomId: setRoomIdReducer,
  },
});

export const { setRoomId } = roomSlice.actions;
export const roomReducer = roomSlice.reducer;
