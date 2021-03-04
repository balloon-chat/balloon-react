import { RoomEntity } from 'src/domain/room/repository/roomEntity';
import { RoomId } from 'src/domain/room/models/roomId';

export interface IRoomRepository {

  find(roomId: RoomId): Promise<RoomEntity | undefined>;

  save(room: RoomEntity): Promise<void>;
}
