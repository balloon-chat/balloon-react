import { UserId } from 'src/domain/user/models/userId';
import { MessageEntity, MessageEntityFactory } from 'src/domain/message/repository/messageEntity';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { IllegalArgumentException } from 'src/domain/exceptions/IllegalArgumentException';
import { MessageBody } from 'src/domain/message/models/messageBody';

export interface IAddMessage {
  /**
   * 新しくメッセージを作成する。
   * @param value メッセージボディー
   * @param senderId メッセージを作成したユーザーのID
   * @return 作成されたメッセージ
   * @throws IllegalArgumentException value が MessageBodyの条件を満たさなかったとき
   */
  execute(value: string, senderId: UserId): Promise<MessageEntity>;
}

export class AddMessage implements IAddMessage {
  constructor(private readonly messageRepository: IMessageRepository) {
  }

  /**
   * 新しくメッセージを作成し、IMessageRepositoryに保存する。
   */
  async execute(value: string, senderId: UserId): Promise<MessageEntity> {
    if (!MessageBody.require(value)) {
      return Promise.reject(new IllegalArgumentException('value must satisfy the constraints of MessageBody'));
    }
    const body = new MessageBody(value);
    const entity = new MessageEntityFactory().create(body, senderId);
    await this.messageRepository.save(entity);
    return Promise.resolve(entity);
  }
}
