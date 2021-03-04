import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { MessageId } from 'src/domain/message/models/messageId';
import { RoomId } from 'src/domain/room/models/roomId';
import { Observable } from 'rxjs';

export interface IMessageRepository {

  find(messageId: MessageId): Promise<MessageEntity |  undefined>;

  observeAll(roomId: RoomId): Observable<MessageEntity[]>;

  save(message: MessageEntity): Promise<void>;
}
