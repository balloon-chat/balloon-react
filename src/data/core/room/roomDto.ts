import { Room } from 'src/domain/room/models/room';
import { RoomId } from 'src/domain/room/models/roomId';
import { RoomTitle } from 'src/domain/room/models/roomTitle';
import { UserId } from 'src/domain/user/models/userId';

export class RoomDto {
  constructor(
      readonly id: string,
      readonly title: string,
      readonly createdAt: number,
      readonly createdBy: string,
  ) {
  }

  static from(room: Room): RoomDto {
    return new RoomDto(
        room.id.value,
        room.title.value,
        room.createdAt,
        room.createdBy.value,
    );
  }

  toRoom(): Room {
    return new Room(
        new RoomId(this.id),
        new RoomTitle(this.title),
        this.createdAt,
        new UserId(this.createdBy),
    );
  }
}
