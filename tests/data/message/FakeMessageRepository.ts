import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { FakeBaseRepository } from 'tests/data/FakeBaseRepository';
import { MessageId } from 'src/domain/message/models/messageId';
import { Observable } from 'rxjs';
import { RoomId } from 'src/domain/room/models/roomId';

export class FakeMessageRepository implements IMessageRepository {
  private repository = new FakeBaseRepository<MessageId, MessageEntity>();

  find(messageId: MessageId): Promise<MessageEntity | undefined> {
    return Promise.resolve(this.repository.find(messageId));
  }

  observeAll(_: RoomId): Observable<MessageEntity[]> {
    return this.repository.observeAll();
  }

  save(_: RoomId, message: MessageEntity): Promise<void> {
    this.repository.save(message.id, message);
    return Promise.resolve(undefined);
  }
}
