import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { MessageId } from 'src/domain/message/models/messageId';
import { RoomId } from 'src/domain/room/models/roomId';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { Observable } from 'rxjs';
import { IMessageDatabase } from 'src/data/core/message/messageDatabase';
import { map } from 'rxjs/operators';
import { MessageDto } from 'src/data/core/message/messageDto';

export class MessageRepository implements IMessageRepository {

  constructor(
      private readonly messageDatabase: IMessageDatabase,
  ) {
  }

  async find(roomId: RoomId, messageId: MessageId): Promise<MessageEntity | undefined> {
    const dto = await this.messageDatabase.find(roomId.value, messageId.value);
    return dto?.toEntity();
  }

  observeAll(roomId: RoomId): Observable<MessageEntity[]> {
    return this.messageDatabase.observeAll(roomId.value).pipe<MessageEntity[]>(
        map((dto: MessageDto[]) => MessageDto.toEntities(dto)),
    );
  }

  async save(roomId: RoomId, message: MessageEntity): Promise<void> {
    await this.messageDatabase.save(roomId.value, MessageDto.from(message));
  }

  messageCount(roomId: RoomId): Promise<number> {
    return this.messageDatabase.messageCount(roomId.value);
  }
}
