import { RoomId } from 'src/domain/room/models/roomId';
import { Observable } from 'rxjs';
import { MessageId } from 'src/domain/message/models/messageId';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { UserId } from 'src/domain/user/models/userId';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { map } from 'rxjs/operators';

/**
 * 詳細な情報を含まないメッセージに関するデータを取得
 */
export interface IObserveMessageData{
  execute(roomId: RoomId): Observable<MessageData[]>;
}

export class MessageData {
  constructor(
      public readonly id: MessageId,
      public readonly body: MessageBody,
      public readonly senderId: UserId,
      public readonly createdAt: number,
  ) {
  }
}

class MessageDataFactory {
  create(...entity: MessageEntity[]): MessageData[] {
    return entity.map(entity => new MessageData(
        entity.id,
        entity.body,
        entity.senderId,
        entity.createdAt,
    ));
  }
}

export class ObserveMessageData implements IObserveMessageData {

  private readonly factory: MessageDataFactory = new MessageDataFactory();

  constructor(private readonly messageRepository: IMessageRepository) {
  }

  execute(roomId: RoomId): Observable<MessageData[]> {
    return this.messageRepository.observeAll(roomId)
        .pipe(map(entities => this.factory.create(...entities)));
  }
}
