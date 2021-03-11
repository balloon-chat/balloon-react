import { RoomId } from 'src/domain/room/models/roomId';
import { RoomTitle } from 'src/domain/room/models/roomTitle';
import { UserId } from 'src/domain/user/models/userId';
import { RoomDescription } from 'src/domain/room/models/roomDescription';

export class Room {
  constructor(
      public readonly id: RoomId,
      public readonly title: RoomTitle,
      public readonly createdAt: number,
      public readonly createdBy: UserId,
      public readonly description?: RoomDescription,
  ) {
  }
}

export class RoomFactory {
  create(title: RoomTitle, createdBy: UserId, description?: string, cratedAt?: number): Room {
    return new Room(
        new RoomId(),
        title,
        cratedAt ?? Date.now(),
        createdBy,
        RoomDescription.create(description),
    );
  }
}
