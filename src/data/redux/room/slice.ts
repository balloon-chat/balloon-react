import { createSlice } from '@reduxjs/toolkit';
import { RoomState, roomStateName, roomStates } from 'src/data/redux/room/state';
import { setIsRoomCreatedReducer, setRoomIdReducer } from 'src/data/redux/room/reducer';
import { createRoom, fetchRoom, fetchRooms } from 'src/data/redux/room/action';
import { RoomEntity } from 'src/view/types/room';

const initialState: RoomState = {
  rooms: [] as RoomEntity[],
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
        }))
        .addCase(fetchRooms.fulfilled, (state, { payload }) => ({
          ...state,
          rooms: payload,
        }))
        .addCase(fetchRoom.fulfilled, (state, { payload }) => ({
          ...state,
          state: payload === undefined ? roomStates.NotFound : undefined,
          currentRoom: payload,
        }));
  },
});

export const { setIsRoomCreated, setRoomId } = roomSlice.actions;
export const roomReducer = roomSlice.reducer;
