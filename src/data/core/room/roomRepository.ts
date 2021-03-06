import { IRoomRepository } from 'src/domain/room/repository/roomRepository';
import { RoomId } from 'src/domain/room/models/roomId';
import { RoomEntity } from 'src/domain/room/repository/roomEntity';
import { IRoomDatabase } from 'src/data/core/room/roomDatabase';
import { RoomDto } from 'src/data/core/room/roomDto';

export class RoomRepository implements IRoomRepository {

  constructor(
      private readonly roomDatabase: IRoomDatabase,
  ) {
  }

  async find(roomId: RoomId): Promise<RoomEntity | undefined> {
    const dto = await this.roomDatabase.find(roomId.value);
    return dto?.toRoom();
  }

  async save(room: RoomEntity): Promise<void> {
    await this.roomDatabase.save(RoomDto.from(room));
  }

}
