import { Room } from 'src/domain/room/models/room';
import { RoomId } from 'src/domain/room/models/roomId';
import { RoomTitle } from 'src/domain/room/models/roomTitle';
import { UserId } from 'src/domain/user/models/userId';
import { RoomDescription } from 'src/domain/room/models/roomDescription';
import { RoomEntity } from 'src/domain/room/repository/roomEntity';

export class RoomDto {
  constructor(
      readonly id: string,
      readonly title: string,
      readonly description: string,
      readonly createdAt: number,
      readonly createdBy: string,
  ) {
  }

  static from(room: RoomEntity): RoomDto {
    return new RoomDto(
        room.id.value,
        room.title.value,
        room.description?.value ?? '',
        room.createdAt,
        room.createdBy.value,
    );
  }

  static fromJSON(json: Object | null): RoomDto | undefined {
    if (json && isRoomJSON(json)) {
      const src = json as RoomJSON;
      return new RoomDto(
          src.id,
          src.title,
          src.description,
          src.createdAt,
          src.createdBy,
      );
    }
  }

  static toRoomEntities(dto: RoomDto[]): RoomEntity[] {
    return dto.map((d) => d.toRoomEntity());
  }

  toRoomEntity(): RoomEntity {
    return new Room(
        new RoomId(this.id),
        new RoomTitle(this.title),
        this.createdAt,
        new UserId(this.createdBy),
        RoomDescription.create(this.description),
    );
  }

  toJSON(): RoomJSON {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
    };
  }
}

type RoomJSON = {
  id: string,
  title: string,
  description: string,
  createdAt: number,
  createdBy: string,
};

const isRoomJSON = (obj: any): obj is RoomJSON => {
  return typeof obj.id === 'string'
      && typeof obj.title === 'string'
      && typeof obj.description === 'string'
      && typeof obj.createdAt === 'number'
      && typeof obj.createdBy === 'string';
};
