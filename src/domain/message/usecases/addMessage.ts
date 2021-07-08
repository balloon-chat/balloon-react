import { UserId } from 'src/domain/user/models/userId';
import { MessageEntity, MessageEntityFactory } from 'src/domain/message/repository/types/messageEntity';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { IllegalArgumentException } from 'src/domain/exceptions/IllegalArgumentException';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { TopicId } from 'src/domain/topic/models/topicId';
import { IAddMessage } from 'src/domain/message/types/addMessage';

export class AddMessage implements IAddMessage {
  constructor(private readonly messageRepository: IMessageRepository) {}

  /**
   * 新しくTopicを作成し、IMessageRepositoryに保存する。
   */
  async execute(
    message: string,
    senderId: UserId,
    topicId: TopicId,
  ): Promise<MessageEntity> {
    if (!MessageBody.require(message)) {
      return Promise.reject(
        new IllegalArgumentException(
          'message must satisfy the constraints of MessageBody',
        ),
      );
    }

    const entity = MessageEntityFactory.create(message, senderId);
    await this.messageRepository.save(topicId, entity);
    return entity;
  }
}
