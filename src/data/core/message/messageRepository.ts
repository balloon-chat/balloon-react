import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { MessageId } from 'src/domain/message/models/messageId';
import { TopicId } from 'src/domain/topic/models/topicId';
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

  async find(topicId: TopicId, messageId: MessageId): Promise<MessageEntity | undefined> {
    const dto = await this.messageDatabase.find(topicId.value, messageId.value);
    return dto?.toEntity();
  }

  observeAll(topicId: TopicId): Observable<MessageEntity[]> {
    return this.messageDatabase.observeAll(topicId.value).pipe<MessageEntity[]>(
        map((dto: MessageDto[]) => MessageDto.toEntities(dto)),
    );
  }

  async save(topicId: TopicId, message: MessageEntity): Promise<void> {
    await this.messageDatabase.save(topicId.value, MessageDto.from(message));
  }

  messageCount(topicId: TopicId): Promise<number> {
    return this.messageDatabase.messageCount(topicId.value);
  }
}
