export const roomStateName = 'roomState';

export type RoomState = {
  roomId?: string,
  rooms: ReduxRoomEntity[],
  isRoomCreated: boolean,
};

export type ReduxRoomEntity = {
  id: string,
  title: string,
  description?: string,
  createdAt: Date,
  thumbnailUrl: string,
  commentCount: number,
};
