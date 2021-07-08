import { MessageEntity } from 'src/domain/message/repository/types/messageEntity';
import { MessageId } from 'src/domain/message/models/messageId';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { UserId } from 'src/domain/user/models/userId';

export class MessageDto {
  constructor(
    readonly id: string,
    readonly body: string,
    readonly createdAt: number,
    readonly senderId: string,
  ) {}

  static toEntities(dto: MessageDto[]): MessageEntity[] {
    return dto.map((d: MessageDto) => d.toEntity());
  }

  static from(message: MessageEntity): MessageDto {
    return new MessageDto(
      message.id.value,
      message.body.value,
      message.createdAt,
      message.senderId.value,
    );
  }

  static fromJSON(json: Object | null): MessageDto | undefined {
    if (json && isMessageJSON(json)) {
      const src = json as MessageJSON;
      return new MessageDto(src.id, src.body, src.createdAt, src.senderId);
    }
    return undefined;
  }

  toEntity(): MessageEntity {
    return new MessageEntity(
      new MessageId(this.id),
      new MessageBody(this.body),
      this.createdAt,
      new UserId(this.senderId),
    );
  }

  toJSON(): MessageJSON {
    return {
      id: this.id,
      body: this.body,
      createdAt: this.createdAt,
      senderId: this.senderId,
    };
  }
}

export type MessageJSON = {
  id: string;
  body: string;
  createdAt: number;
  senderId: string;
};

const isMessageJSON = (obj: any): obj is MessageJSON => typeof obj.id === 'string'
  && typeof obj.body === 'string'
  && typeof obj.createdAt === 'number'
  && typeof obj.senderId === 'string';
