import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { MessageId } from 'src/domain/message/models/messageId';
import { RoomId } from 'src/domain/room/models/roomId';
import { Observable } from 'rxjs';

export interface IMessageRepository {

  find(roomId: RoomId, messageId: MessageId): Promise<MessageEntity |  undefined>;

  /**
   * 指定した Room 内のメッセージの総数を取得
   * @param roomId メッセージ数を調べるRoomのID
   */
  messageCount(roomId: RoomId): Promise<number>;

  observeAll(roomId: RoomId): Observable<MessageEntity[]>;

  save(roomId: RoomId, message: MessageEntity): Promise<void>;
}
