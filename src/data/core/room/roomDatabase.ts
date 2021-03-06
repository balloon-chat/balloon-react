import { RoomDto } from 'src/data/core/room/roomDto';

export interface IRoomDatabase {

  find(roomId: string): Promise<RoomDto | undefined>;

  save(room: RoomDto): Promise<void>;
}
