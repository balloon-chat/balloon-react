import { RoomDto } from 'src/data/core/room/roomDto';

export interface IRoomDatabase {

  find(roomId: string): Promise<RoomDto | undefined>;

  findAll(): Promise<RoomDto[]>;

  findAllSortByCreatedAt(limit: number): Promise<RoomDto[]>;

  save(room: RoomDto): Promise<void>;
}
