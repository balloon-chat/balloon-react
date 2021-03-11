import { UserId } from 'src/domain/user/models/userId';
import { MessageEntity, MessageEntityFactory } from 'src/domain/message/repository/messageEntity';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { IllegalArgumentException } from 'src/domain/exceptions/IllegalArgumentException';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { TopicId } from 'src/domain/topic/models/topicId';

export interface IAddMessage {
  /**
   * 新しくメッセージを作成する。
   * @param message メッセージボディー
   * @param senderId メッセージを作成したユーザーのID
   * @param topicId メッセージの送信先となるTopicのID
   * @return 作成されたメッセージ
   * @throws IllegalArgumentException message が MessageBodyの条件を満たさなかったとき
   */
  execute(message: string, senderId: UserId, topicId: TopicId): Promise<MessageEntity>;
}

export class AddMessage implements IAddMessage {
  constructor(private readonly messageRepository: IMessageRepository) {
  }

  /**
   * 新しくTopicを作成し、IMessageRepositoryに保存する。
   */
  async execute(value: string, senderId: UserId, topicId: TopicId): Promise<MessageEntity> {
    if (!MessageBody.require(value)) {
      return Promise.reject(new IllegalArgumentException('value must satisfy the constraints of MessageBody'));
    }

    const message = MessageEntityFactory.create(new MessageBody(value), senderId);
    await this.messageRepository.save(topicId, message);
    return Promise.resolve(message);
  }
}
