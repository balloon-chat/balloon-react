import { RoomId } from 'src/domain/room/models/roomId';
import { RoomTitle } from 'src/domain/room/models/roomTitle';
import { Room } from 'src/domain/room/models/room';
import { UserId } from 'src/domain/user/models/userId';
import { RoomDescription } from 'src/domain/room/models/roomDescription';

export class RoomEntity {
  constructor(
      public readonly id: RoomId,
      public readonly title: RoomTitle,
      public readonly createdAt: number,
      public readonly createdBy: UserId,
      public readonly description?: RoomDescription,
  ) {
  }

  static from(room: Room): RoomEntity {
    return new RoomEntity(
        room.id,
        room.title,
        room.createdAt,
        room.createdBy,
        room.description,
    );
  }
}
