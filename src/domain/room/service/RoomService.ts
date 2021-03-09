import { IRoomRepository } from 'src/domain/room/repository/roomRepository';
import { RoomRepository } from 'src/data/core/room/roomRepository';
import { CreateRoom, ICreateRoom } from 'src/domain/room/usecases/createRoom';
import { Room } from 'src/domain/room/models/room';
import { UserId } from 'src/domain/user/models/userId';
import { FirebaseRoomDatabase } from 'src/data/firebase/room/roomDatabase';

export class RoomService {
  private readonly createRoomUsecase: ICreateRoom;

  constructor(roomRepository: IRoomRepository = new RoomRepository(FirebaseRoomDatabase.instance)) {
    this.createRoomUsecase = new CreateRoom(roomRepository);
  }

  createRoom(title: string, description: string, createdBy: string): Promise<Room> {
    return this.createRoomUsecase.execute(title, description, new UserId(createdBy));
  }
}
