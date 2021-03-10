import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { IRoomRepository } from 'src/domain/room/repository/roomRepository';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { RoomId } from 'src/domain/room/models/roomId';
import { RoomData } from 'src/domain/room/usecases/types';

export interface IGetRoom {
  execute(roomId: RoomId): Promise<RoomData | undefined>;
}

export class GetRoom {

  constructor(
      private readonly messageRepository: IMessageRepository,
      private readonly roomRepository: IRoomRepository,
      private readonly userRepository: IUserRepository,
  ) {
  }

  async execute(roomId: RoomId): Promise<RoomData | undefined> {
    const room = await this.roomRepository.find(roomId);
    if (!room) return;
    const createdBy = await this.userRepository.find(room.createdBy);
    if (!createdBy) return;

    const commentCount = await this.messageRepository.messageCount(room.id);

    return {
      id: room.id,
      title: room.title,
      description: room.description,
      thumbnailUrl: 'http://placehold.jp/1600x800.png',
      createdAt: new Date(room.createdAt),
      createdBy,
      commentCount,
    } as const;
  }
}
