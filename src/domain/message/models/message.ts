// eslint-disable-next-line max-classes-per-file
import { User } from 'src/domain/user/models/user';
import { MessageId } from 'src/domain/message/models/messageId';
import { MessageBody } from 'src/domain/message/models/messageBody';

export class MessageFactory {
  static create(body: MessageBody, sender: User): Message {
    return new Message(new MessageId(), body, Date.now(), sender);
  }
}

export class Message {
  constructor(
    public readonly id: MessageId = new MessageId(),
    public readonly body: MessageBody,
    public readonly createdAt: number = Date.now(),
    public readonly sender: User,
  ) {}

  get isAnonymousMessage():boolean {
    return !this.sender.name;
  }
}
