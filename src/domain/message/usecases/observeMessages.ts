import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { Observable, Operator, Subscriber, TeardownLogic } from 'rxjs';
import { RoomId } from 'src/domain/room/models/roomId';
import { Message } from 'src/domain/message/models/message';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { AnonymousUser, User } from 'src/domain/user/models/user';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { UserId } from 'src/domain/user/models/userId';

/**
 * ユーザー情報などメッセージに関する詳細な情報を含むデータを取得
 */
export interface IObserveMessages {
  execute(roomId: RoomId): Observable<Message[]>;
}

export class ObserveMessages implements IObserveMessages {
  constructor(
      public readonly messageRepository: IMessageRepository,
      public readonly userRepository: IUserRepository,
  ) {
  }

  execute(roomId: RoomId): Observable<Message[]> {
    return this.messageRepository.observeAll(roomId)
        .lift(new BindUserOperator(this.userRepository));
  }
}

class BindUserOperator implements Operator<MessageEntity[], Message[]>{
  // ユーザー情報をキャッシュする
  private cachedUsers: Map<UserId, User | undefined> = new Map<UserId, User>();

  constructor(private readonly userRepository: IUserRepository) {
  }

  call(subscriber: Subscriber<Message[]>, source: Observable<MessageEntity[]>): TeardownLogic {
    source.subscribe({
      next: async (entities) => {

        // ユーザー情報をキャッシュ
        const senderIds = new Set(entities.map((entity: MessageEntity) => entity.senderId));
        for (const senderId of senderIds) {
          // ユーザーがキャッシュされていなかったら、UserRepositoryから取得、キャッシュに追加
          if (senderId && this.cachedUsers.get(senderId) === undefined) {
            const user = await this.userRepository.find(senderId);
            this.cachedUsers.set(senderId, user);
          }
        }

        // メッセージとユーザー情報を結びつける
        const messages = entities.map((entity) => {
          const sender = this.cachedUsers.get(entity.senderId) ?? new AnonymousUser(entity.senderId);
          return new Message(entity.id, entity.body, entity.createdAt, sender);
        });

        subscriber.next(messages);
      },

      error: err => {
        subscriber.error(err);
      },

      complete: () => subscriber.complete(),
    });
  }
}
