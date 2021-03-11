import { IRoomDatabase } from 'src/data/core/room/roomDatabase';
import { RoomDto } from 'src/data/core/room/roomDto';
import firebase from 'firebase';

export class FirebaseRoomDatabase implements IRoomDatabase {
  constructor(
      private readonly database = firebase.database(),
  ) {
  }

  // tslint:disable-next-line:variable-name
  private static _instance: IRoomDatabase;

  static get instance(): IRoomDatabase {
    if (!this._instance) {
      this._instance = new FirebaseRoomDatabase();
    }
    return this._instance;
  }

  async find(roomId: string): Promise<RoomDto | undefined> {
    const snapshot = await this.roomRef(roomId).once('value');
    return RoomDto.fromJSON(snapshot.toJSON());
  }

  async findAll(): Promise<RoomDto[]> {
    const snapshots = await this.roomsRef().once('value');
    const data: RoomDto[] = [];
    snapshots.forEach((snapshot) => {
      const dto = RoomDto.fromJSON(snapshot.toJSON());
      if (dto) data.push(dto);
    });
    return data;
  }

  async findAllSortByCreatedAt(limit: number): Promise<RoomDto[]> {
    const snapshots = await this.roomsRef().orderByChild('createdAt').limitToLast(limit).once('value');
    const data: RoomDto[] = [];
    snapshots.forEach((snapshot) => {
      const dto = RoomDto.fromJSON(snapshot.toJSON());
      if (dto) data.push(dto);
    });
    return data.reverse(); // 降順にする
  }

  async save(room: RoomDto): Promise<void> {
    const ref = this.roomRef(room.id);
    await ref.set(room.toJSON());
  }

  private roomsRef = () => this.database.ref('/rooms/');
  private roomRef = (roomId: string) => this.roomsRef().child(roomId);
}
