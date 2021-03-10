import { RoomId } from 'src/domain/room/models/roomId';
import { RoomTitle } from 'src/domain/room/models/roomTitle';
import { RoomDescription } from 'src/domain/room/models/roomDescription';
import { User } from 'src/domain/user/models/user';

export type RoomData = {
  id: RoomId,
  title: RoomTitle,
  description?: RoomDescription,
  thumbnailUrl: string,
  createdAt: Date,
  createdBy: User,
  commentCount: number,
};
