import { RoomId } from 'src/domain/room/models/roomId';
import { RoomTitle } from 'src/domain/room/models/roomTitle';
import { UserId } from 'src/domain/user/models/userId';

export class Room {
  constructor(
      public readonly id: RoomId,
      public readonly title: RoomTitle,
      public readonly createdAt: number,
      public readonly createdBy: UserId,
  ) {
  }
}

export class RoomFactory {
  create(title: RoomTitle, createdBy: UserId): Room {
    return new Room(
        new RoomId(),
        title,
        Date.now(),
        createdBy,
    );
  }
}
