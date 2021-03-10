import { MessageDto } from 'src/data/core/message/messageDto';
import { Observable } from 'rxjs';

export interface IMessageDatabase {

  find(roomId: string, messageId: string): Promise<MessageDto | undefined>;

  observeAll(roomId: string): Observable<MessageDto[]>;

  save(roomId: string, message: MessageDto): Promise<void>;

  messageCount(roomId: string): Promise<number>;
}
