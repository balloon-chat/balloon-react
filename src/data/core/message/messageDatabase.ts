import { MessageDto } from 'src/data/core/message/messageDto';
import { Observable, Subject } from 'rxjs';

export interface IMessageDatabase {
  find(topicId: string, messageId: string): Promise<MessageDto | undefined>;

  observeAll(topicId: string, unsubscribe?: Subject<void>): Observable<MessageDto[]>;

  save(topicId: string, message: MessageDto): Promise<void>;

  messageCount(topicId: string): Promise<number>;
}
