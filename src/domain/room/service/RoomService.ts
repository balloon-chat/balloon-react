import { IRoomRepository } from 'src/domain/room/repository/roomRepository';
import { RoomRepository } from 'src/data/core/room/roomRepository';
import { CreateRoom, ICreateRoom } from 'src/domain/room/usecases/createRoom';
import { Room } from 'src/domain/room/models/room';
import { UserId } from 'src/domain/user/models/userId';
import { FirebaseRoomDatabase } from 'src/data/firebase/room/roomDatabase';
import { GetRooms, IGetRooms, RoomData } from 'src/domain/room/usecases/getRooms';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { MessageRepository } from 'src/data/core/message/messageRepository';
import { FirebaseMessageDatabase } from 'src/data/firebase/message/messageDatabase';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { UserRepository } from 'src/data/core/user/userRepository';
import { InMemoryUserDatabase } from 'src/data/debug/user/userDatabase';

export class RoomService {
  private readonly createRoomUsecase: ICreateRoom;
  private readonly getRoomsUseCase: IGetRooms;

  constructor(
      roomRepository: IRoomRepository = new RoomRepository(FirebaseRoomDatabase.instance),
      messageRepository: IMessageRepository = new MessageRepository(FirebaseMessageDatabase.instance),
      userRepository: IUserRepository = new UserRepository(InMemoryUserDatabase.instance),
  ) {
    this.createRoomUsecase = new CreateRoom(roomRepository);
    this.getRoomsUseCase = new GetRooms(messageRepository, roomRepository, userRepository);
  }

  createRoom(title: string, description: string, createdBy: string): Promise<Room> {
    return this.createRoomUsecase.execute(title, description, new UserId(createdBy));
  }

  fetchRooms(): Promise<RoomData[]> {
    return this.getRoomsUseCase.execute();
  }
}
