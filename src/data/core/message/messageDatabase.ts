import { MessageDto } from 'src/data/core/message/messageDto';
import { Observable } from 'rxjs';

export interface IMessageDatabase {
  find(topicId: string, messageId: string): Promise<MessageDto | undefined>;

  observeAll(topicId: string): Observable<MessageDto[]>;

  save(topicId: string, message: MessageDto): Promise<void>;

  messageCount(topicId: string): Promise<number>;
}
