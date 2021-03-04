import { MessageId } from 'src/domain/message/models/messageId';
import { UserId } from 'src/domain/user/models/userId';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { Message } from 'src/domain/message/models/message';

export class MessageEntityFactory {
  createFromMessage(message: Message): MessageEntity {
    return new MessageEntity(
        message.id,
        message.body,
        message.createdAt,
        message.sender.id,
    );
  }

  create(body: MessageBody, senderId: UserId, createdAt: number = Date.now()): MessageEntity {
    return new MessageEntity(
        new MessageId(),
        body,
        createdAt,
        senderId,
    );
  }
}

export class MessageEntity {
  constructor(
      public readonly id: MessageId,
      public readonly body: MessageBody,
      public readonly createdAt: number,
      public readonly senderId: UserId,
  ) {
  }
}
