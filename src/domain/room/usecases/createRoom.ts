import { Room, RoomFactory } from 'src/domain/room/models/room';
import { IRoomRepository } from 'src/domain/room/repository/roomRepository';
import { RoomTitle } from 'src/domain/room/models/roomTitle';
import { RoomEntity } from 'src/domain/room/repository/roomEntity';
import { UserId } from 'src/domain/user/models/userId';
import { IllegalArgumentException } from 'src/domain/exceptions/IllegalArgumentException';

export interface ICreateRoom {
  /**
   * @param title ルームのタイトル
   * @param description ルームの説明
   * @param createdBy ルームの作成者
   * @return 作成された Room
   * @throws IllegalArgumentException title が RoomTitle の条件を満たさなかったとき
   */
  execute(title: string, description: string, createdBy: UserId): Promise<Room>;
}

export class CreateRoom implements ICreateRoom {

  constructor(private readonly roomRepository: IRoomRepository) {
  }

  async execute(title: string, description: string, createdBy: UserId): Promise<Room> {
    if (!RoomTitle.require(title)) {
      throw new IllegalArgumentException('value must satisfy the constraints of RoomTitle');
    }

    const roomTitle = new RoomTitle(title);
    const room = new RoomFactory().create(roomTitle, createdBy, description);
    const entity = RoomEntity.from(room);
    await this.roomRepository.save(entity);
    return room;
  }
}
