import { MessageDto } from 'src/data/core/message/messageDto';
import { Observable } from 'rxjs';

export interface IMessageDatabase {

  find(messageId: string): Promise<MessageDto | undefined>;

  observeAll(roomId: string): Observable<MessageDto[]>;

  save(message: MessageDto): Promise<void>;
}
