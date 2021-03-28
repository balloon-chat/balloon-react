import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { FakeBaseRepository } from 'tests/data/FakeBaseRepository';
import { MessageId } from 'src/domain/message/models/messageId';
import { Observable } from 'rxjs';
import { TopicId } from 'src/domain/topic/models/topicId';
import { map } from 'rxjs/operators';

export class FakeMessageRepository implements IMessageRepository {
  private repository = new FakeBaseRepository<TopicId, Map<MessageId, MessageEntity>>();

  async find(messageId: MessageId): Promise<MessageEntity | undefined> {
    const entities = await this.repository.findAll();
    const messages = entities.find((entity) => entity.has(messageId));
    return Promise.resolve(messages?.get(messageId));
  }

  observeAll(topicId: TopicId): Observable<MessageEntity[]> {
    return this.repository
      .observe(topicId)
      .pipe(
        map((messages) => (messages ? Array.from(messages.values()) : [])),
      );
  }

  save(topicId: TopicId, message: MessageEntity): Promise<void> {
    const entity = this.repository.find(topicId) ?? new Map<MessageId, MessageEntity>();
    entity.set(message.id, message);
    this.repository.save(topicId, entity);
    return Promise.resolve(undefined);
  }

  messageCount(topicId: TopicId): Promise<number> {
    const messages = this.repository.find(topicId);
    return Promise.resolve(messages?.size ?? 0);
  }

  clean() {
    this.repository.clean();
  }
}
