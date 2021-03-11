import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { FakeBaseRepository } from 'tests/data/FakeBaseRepository';
import { MessageId } from 'src/domain/message/models/messageId';
import { Observable } from 'rxjs';
import { TopicId } from 'src/domain/topic/models/topicId';

export class FakeMessageRepository implements IMessageRepository {
  private repository = new FakeBaseRepository<MessageId, MessageEntity>();

  find(messageId: MessageId): Promise<MessageEntity | undefined> {
    return Promise.resolve(this.repository.find(messageId));
  }

  observeAll(_: TopicId): Observable<MessageEntity[]> {
    return this.repository.observeAll();
  }

  save(_: TopicId, message: MessageEntity): Promise<void> {
    this.repository.save(message.id, message);
    return Promise.resolve(undefined);
  }

  messageCount(_: TopicId): Promise<number> {
    return Promise.resolve(this.repository.findAll().length);
  }

  clean() {
    this.repository.clean();
  }
}
