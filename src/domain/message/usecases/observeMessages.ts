import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { Observable, Operator, Subscriber, TeardownLogic } from 'rxjs';
import { TopicId } from 'src/domain/topic/models/topicId';
import { Message } from 'src/domain/message/models/message';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { AnonymousUser, User } from 'src/domain/user/models/user';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { map } from 'rxjs/operators';

/**
 * ユーザー情報などメッセージに関する詳細な情報を含むデータを取得
 */
export interface IObserveMessages {
  execute(topicId: TopicId): Observable<Message[]>;
}

export class ObserveMessages implements IObserveMessages {
  constructor(
      public readonly messageRepository: IMessageRepository,
      public readonly userRepository: IUserRepository,
  ) {
  }

  execute(topicId: TopicId): Observable<Message[]> {
    const bindUserOperator = new BindUserOperator(this.userRepository);
    return this.messageRepository.observeAll(topicId)
        .lift(bindUserOperator)
        .pipe(map(messages => {
          return messages.sort((a, b) => b.createdAt - a.createdAt);
        }));
  }
}

class BindUserOperator implements Operator<MessageEntity[], Message[]> {
  // ユーザー情報をキャッシュする
  private cachedUsers: Map<string, User | undefined> = new Map<string, User>();

  constructor(private readonly userRepository: IUserRepository) {
  }

  call(subscriber: Subscriber<Message[]>, source: Observable<MessageEntity[]>): TeardownLogic {
    source.subscribe({
      next: async (entities) => {
        // ユーザー情報をキャッシュ
        const senderIdSet = new Set(entities.map((entity: MessageEntity) => entity.senderId));
        const senderIds = Array.from(senderIdSet);

        await Promise.all(senderIds.map(async (senderId) => {
          if (senderId && !this.cachedUsers.get(senderId.value)) {
            // ユーザーがキャッシュされていない場合、UserRepositoryから取得、キャッシュに追加
            const user = await this.userRepository.find(senderId) ?? new AnonymousUser(senderId);
            this.cachedUsers.set(senderId.value, user);
          }
        }));

        // メッセージとユーザー情報を結びつける
        const messages = entities.map((entity) => {
          const sender = this.cachedUsers.get(entity.senderId.value) ?? new AnonymousUser(entity.senderId);
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
