import { RoomEntity } from 'src/view/types/room';

export const roomStateName = 'roomState';

export type RoomState = {
  currentRoom?: RoomEntity,
  roomId?: string,
  rooms: RoomEntity[],
  pickup?: RoomEntity
  isRoomCreated: boolean,
  state?: RoomStates,
};

export const roomStates = {
  NotFound: 'NOT_FOUND',
} as const;

type RoomStates = typeof roomStates[keyof typeof roomStates];
