import { IRoomRepository } from 'src/domain/room/repository/roomRepository';
import { RoomId } from 'src/domain/room/models/roomId';
import { RoomTitle } from 'src/domain/room/models/roomTitle';
import { RoomDescription } from 'src/domain/room/models/roomDescription';
import { User } from 'src/domain/user/models/user';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { IUserRepository } from 'src/domain/user/repository/userRepository';

export interface IGetRooms {
  execute(): Promise<RoomData[]>;
}

export type RoomData = {
  id: RoomId,
  title: RoomTitle,
  description?: RoomDescription,
  thumbnailUrl: string,
  createdAt: Date,
  createdBy: User,
  commentCount: number,
};

export class GetRooms implements IGetRooms {

  constructor(
      private readonly messageRepository: IMessageRepository,
      private readonly roomRepository: IRoomRepository,
      private readonly userRepository: IUserRepository,
  ) {
  }

  async execute(): Promise<RoomData[]> {
    const rooms = await this.roomRepository.findAll();
    const data: RoomData[] = [];

    for (const room of rooms) {
      const createdBy = await this.userRepository.find(room.createdBy);
      if (!createdBy) continue;
      const commentCount = await this.messageRepository.messageCount(room.id);
      data.push({
        id: room.id,
        title: room.title,
        description: room.description,
        thumbnailUrl: 'http://placehold.jp/1600x800.png',
        createdAt: new Date(room.createdAt),
        createdBy,
        commentCount,
      } as const);
    }

    return data;
  }
}
