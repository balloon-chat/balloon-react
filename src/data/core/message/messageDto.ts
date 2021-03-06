import { Message } from 'src/domain/message/models/message';
import { MessageData } from 'src/domain/message/usecases/observeMessageData';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { MessageId } from 'src/domain/message/models/messageId';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { UserId } from 'src/domain/user/models/userId';

export class MessageDto {
  constructor(
      readonly id: string,
      readonly body: string,
      readonly createdAt: number,
      readonly senderId: string,
  ) {
  }

  static toEntities(dto: MessageDto[]): MessageEntity[] {
    return dto.map((d: MessageDto) => d.toEntity());
  }

  static from(message: Message): MessageDto;
  static from(message: MessageData): MessageDto;
  static from(message: Message | MessageData) {
    if (message instanceof Message) {
      return new MessageDto(
          message.id.value,
          message.body.value,
          message.createdAt,
          message.sender.id.value,
      );
    }

    return new MessageDto(
        message.id.value,
        message.body.value,
        message.createdAt,
        message.senderId.value,
    );
  }

  toEntity(): MessageEntity {
    return new MessageEntity(
        new MessageId(this.id),
        new MessageBody(this.body),
        this.createdAt,
        new UserId(this.senderId),
    );
  }
}
