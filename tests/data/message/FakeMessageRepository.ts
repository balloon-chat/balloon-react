import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { MessageEntity } from 'src/domain/message/repository/types/messageEntity';
import { FakeBaseRepository } from 'tests/data/FakeBaseRepository';
import { MessageId } from 'src/domain/message/models/messageId';
import { Observable } from 'rxjs';
import { TopicId } from 'src/domain/topic/models/topicId';
import { map } from 'rxjs/operators';

export class FakeMessageRepository implements IMessageRepository {
  // key: topic id
  private repository = new FakeBaseRepository<string, Map<MessageId, MessageEntity>>();

  async find(topicId: TopicId, messageId: MessageId): Promise<MessageEntity | null> {
    const messages = this.repository.find(topicId.value);
    if (!messages) return null;
    return messages?.get(messageId) ?? null;
  }

  // for debug
  async findAll(topicId: TopicId): Promise<MessageEntity[]> {
    const messages = this.repository.find(topicId.value);
    if (!messages) return [];
    return Array.from(messages.values());
  }

  observeAll(topicId: TopicId): Observable<MessageEntity[]> {
    return this.repository
      .observe(topicId.value)
      .pipe(
        map((messages) => (messages ? Array.from(messages.values()) : [])),
      );
  }

  save(topicId: TopicId, message: MessageEntity): Promise<void> {
    const entity = this.repository.find(topicId.value) ?? new Map<MessageId, MessageEntity>();
    entity.set(message.id, message);
    this.repository.save(topicId.value, entity);
    return Promise.resolve(undefined);
  }

  messageCount(topicId: TopicId): Promise<number> {
    const messages = this.repository.find(topicId.value);
    return Promise.resolve(messages?.size ?? 0);
  }

  async deleteAllMessagesOf(topicId: TopicId): Promise<void> {
    this.repository.delete(topicId.value);
  }

  clean() {
    this.repository.clean();
  }
}
