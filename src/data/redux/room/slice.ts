import { createSlice } from '@reduxjs/toolkit';
import { RoomState, roomStateName } from 'src/data/redux/room/state';
import { setIsRoomCreatedReducer, setRoomIdReducer } from 'src/data/redux/room/reducer';
import { createRoom } from 'src/data/redux/room/action';

const initialState: RoomState = {
  roomId: undefined,
  isRoomCreated: false,
} as const;

const roomSlice = createSlice({
  name: roomStateName,
  initialState,
  reducers: {
    setRoomId: setRoomIdReducer,
    setIsRoomCreated: setIsRoomCreatedReducer,
  },
  extraReducers: builder => {
    builder
        .addCase(createRoom.fulfilled, (state, { payload }) => ({
          ...state,
          roomId: payload.id.value,
          isRoomCreated: true,
        }));
  },
});

export const { setIsRoomCreated, setRoomId } = roomSlice.actions;
export const roomReducer = roomSlice.reducer;
