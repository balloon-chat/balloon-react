// eslint-disable-next-line max-classes-per-file
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { Observable, Operator, Subject, Subscriber, TeardownLogic } from 'rxjs';
import { TopicId } from 'src/domain/topic/models/topic/topicId';
import { Message } from 'src/domain/message/models/message';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { User } from 'src/domain/user/models/user';
import { MessageEntity } from 'src/domain/message/repository/types/messageEntity';
import { map } from 'rxjs/operators';
import { AnonymousUser } from 'src/domain/user/models/anonymousUser';
import { IObserveMessages } from 'src/domain/message/types/observeMessages';

export class ObserveMessages implements IObserveMessages {
  constructor(
    public readonly messageRepository: IMessageRepository,
    public readonly userRepository: IUserRepository,
  ) {
  }

  execute(topicId: TopicId, unsubscribe?: Subject<void>): Observable<Message[]> {
    const bindUserOperator = new BindUserOperator(this.userRepository);
    return this.messageRepository
      .observeAll(topicId, unsubscribe)
      .lift(bindUserOperator)
      .pipe(
        map((messages) => messages.sort((a, b) => b.createdAt - a.createdAt)),
      );
  }
}

class BindUserOperator implements Operator<MessageEntity[], Message[]> {
  // ユーザー情報をキャッシュする
  private cachedUsers: Map<string, User | undefined> = new Map<string, User>();

  constructor(private readonly userRepository: IUserRepository) {
  }

  call(
    subscriber: Subscriber<Message[]>,
    source: Observable<MessageEntity[]>,
  ): TeardownLogic {
    source.subscribe({
      next: async (entities) => {
        // ユーザー情報をキャッシュ
        const senderIdSet = new Set(
          entities.map((entity: MessageEntity) => entity.senderId),
        );
        const senderIds = Array.from(senderIdSet);

        await Promise.all(
          senderIds.map(async (senderId) => {
            if (senderId && !this.cachedUsers.get(senderId.value)) {
              // ユーザーがキャッシュされていない場合、UserRepositoryから取得、キャッシュに追加
              // 一時的なユーザーの場合は、AnonymousUserとして扱う
              const user = await this.userRepository.find(senderId) ?? new AnonymousUser(senderId);
              this.cachedUsers.set(senderId.value, user);
            }
          }),
        );

        // メッセージとユーザー情報を結びつける
        const messages = entities.map((entity) => {
          const sender = this.cachedUsers.get(entity.senderId.value)
            ?? new AnonymousUser(entity.senderId);
          return new Message(entity.id, entity.body, entity.createdAt, sender);
        });

        subscriber.next(messages);
      },

      error: (err) => {
        subscriber.error(err);
      },

      complete: () => subscriber.complete(),
    });
  }
}
