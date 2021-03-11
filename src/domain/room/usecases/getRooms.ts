import { IRoomRepository } from 'src/domain/room/repository/roomRepository';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { RoomData } from 'src/domain/room/usecases/types';

export interface IGetRooms {
  /**
   * RoomDataの一覧を取得する
   * @param limit 取得する項目数の上限
   */
  execute(limit: number): Promise<RoomData[]>;
}

export class GetRooms implements IGetRooms {

  constructor(
      private readonly messageRepository: IMessageRepository,
      private readonly roomRepository: IRoomRepository,
      private readonly userRepository: IUserRepository,
  ) {
  }

  /**
   * Roomを日付順に並び替えた状態で、Roomを取得する。
   */
  async execute(limit: number): Promise<RoomData[]> {
    const rooms = await this.roomRepository.findAllOrderByCreatedAt(limit);
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
