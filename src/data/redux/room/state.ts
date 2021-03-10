export const roomStateName = 'roomState';

export type RoomState = {
  currentRoom?: ReduxRoomEntity,
  roomId?: string,
  rooms: ReduxRoomEntity[],
  isRoomCreated: boolean,
  state?: RoomStates,
};

export const roomStates = {
  NotFound: 'NOT_FOUND',
} as const;

type RoomStates = typeof roomStates[keyof typeof roomStates];

export type ReduxRoomEntity = {
  id: string,
  title: string,
  description?: string,
  createdAt: Date,
  thumbnailUrl: string,
  commentCount: number,
};
