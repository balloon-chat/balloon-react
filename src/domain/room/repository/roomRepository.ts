import { RoomEntity } from 'src/domain/room/repository/roomEntity';
import { RoomId } from 'src/domain/room/models/roomId';

export interface IRoomRepository {

  find(roomId: RoomId): Promise<RoomEntity | undefined>;

  findAll(): Promise<RoomEntity[]>;

  findAllOrderByCreatedAt(limit: number): Promise<RoomEntity[]>;

  save(room: RoomEntity): Promise<void>;
}
