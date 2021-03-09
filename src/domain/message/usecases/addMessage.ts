import { UserId } from 'src/domain/user/models/userId';
import { MessageEntity, MessageEntityFactory } from 'src/domain/message/repository/messageEntity';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { IllegalArgumentException } from 'src/domain/exceptions/IllegalArgumentException';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { RoomId } from 'src/domain/room/models/roomId';

export interface IAddMessage {
  /**
   * 新しくメッセージを作成する。
   * @param message メッセージボディー
   * @param senderId メッセージを作成したユーザーのID
   * @param roomId メッセージの送信先となるRoomのID
   * @return 作成されたメッセージ
   * @throws IllegalArgumentException message が MessageBodyの条件を満たさなかったとき
   */
  execute(message: string, senderId: UserId, roomId: RoomId): Promise<MessageEntity>;
}

export class AddMessage implements IAddMessage {
  constructor(private readonly messageRepository: IMessageRepository) {
  }

  /**
   * 新しくメッセージを作成し、IMessageRepositoryに保存する。
   */
  async execute(value: string, senderId: UserId, roomId: RoomId): Promise<MessageEntity> {
    if (!MessageBody.require(value)) {
      return Promise.reject(new IllegalArgumentException('value must satisfy the constraints of MessageBody'));
    }

    const message = MessageEntityFactory.create(new MessageBody(value), senderId);
    await this.messageRepository.save(roomId, message);
    return Promise.resolve(message);
  }
}
