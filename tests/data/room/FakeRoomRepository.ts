import { IRoomRepository } from 'src/domain/room/repository/roomRepository';
import { RoomEntity } from 'src/domain/room/repository/roomEntity';
import { RoomId } from 'src/domain/room/models/roomId';
import { FakeBaseRepository } from 'tests/data/FakeBaseRepository';

export class FakeRoomRepository implements IRoomRepository {
  private readonly repository = new FakeBaseRepository<RoomId, RoomEntity>();

  find(roomId: RoomId): Promise<RoomEntity | undefined> {
    return Promise.resolve(this.repository.find(roomId));
  }

  findAll(): Promise<RoomEntity[]> {
    return Promise.resolve(this.repository.findAll());
  }

  findAllOrderByCreatedAt(limit: number): Promise<RoomEntity[]> {
    const result = this.repository.findAll().sort((a, b) => b.createdAt - a.createdAt);
    return Promise.resolve(result.slice(0, limit));
  }

  async save(room: RoomEntity): Promise<void> {
    await this.repository.save(room.id, room);
  }

  clean() {
    this.repository.clean();
  }
}
