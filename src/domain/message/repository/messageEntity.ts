// eslint-disable-next-line max-classes-per-file
import { MessageId } from 'src/domain/message/models/messageId';
import { UserId } from 'src/domain/user/models/userId';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { Message } from 'src/domain/message/models/message';

export class MessageEntity {
  constructor(
    public readonly id: MessageId,
    public readonly body: MessageBody,
    public readonly createdAt: number,
    public readonly senderId: UserId,
  ) {}

  static from(message: Message): MessageEntity {
    return new MessageEntity(
      message.id,
      message.body,
      message.createdAt,
      message.sender.id,
    );
  }
}

export class MessageEntityFactory {
  static create(message: string, senderId: UserId): MessageEntity {
    return new MessageEntity(new MessageId(), new MessageBody(message), Date.now(), senderId);
  }
}
