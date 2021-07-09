import { MessageDto } from 'src/data/firebase/message/types/messageDto';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import firebase from 'firebase/app';
import 'firebase/database';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { TopicId } from 'src/domain/topic/models/topic/topicId';
import { MessageId } from 'src/domain/message/models/messageId';
import { MessageEntity } from 'src/domain/message/repository/types/messageEntity';
import { map } from 'rxjs/operators';

export class FirebaseMessageDatabase implements IMessageRepository {
  private constructor(private readonly database = firebase.database()) {}

  private static _instance: IMessageRepository;

  static get instance(): IMessageRepository {
    if (!this._instance) { this._instance = new FirebaseMessageDatabase(); }
    return this._instance;
  }

  async find(
    topicId: TopicId,
    messageId: MessageId,
  ): Promise<MessageEntity | null> {
    const snapshot = await this.messageRef(topicId, messageId).once('value');
    const dto = MessageDto.fromJSON(snapshot.toJSON());
    return dto?.toEntity() ?? null;
  }

  observeAll(topicId: TopicId, unsubscribe?: Subject<void>): Observable<MessageEntity[]> {
    const behaviorSubject = new BehaviorSubject<MessageDto[]>([]);

    this._observeAll(topicId, behaviorSubject, unsubscribe).then();

    return behaviorSubject.pipe(
      map((messages) => messages.map((e) => e.toEntity())),
    );
  }

  /**
   *  保存されているすべてのメッセージを、初期データとして通知する。
   *  以降、新しいメッセージが追加された時のみ、通知を行う。
   */
  private async _observeAll(
    topicId: TopicId,
    behaviorSubject: BehaviorSubject<MessageDto[]>,
    unsubscribe?: Subject<void>,
  ) {
    const messages: MessageDto[] = [];

    // 現段階のすべてのデータを通知する
    const snapshots = await this.messagesRef(topicId).get();
    snapshots.forEach((snapshot) => {
      const dto = MessageDto.fromJSON(snapshot.toJSON());
      if (!dto) return;
      messages.push(dto);
    });

    behaviorSubject.next(messages);
    messages.splice(0); // clear

    // 更新があったデータを通知する
    // child_addedイベントは、読み込み開始時に、更新されていなくても、該当するデータを１件１件通知する。
    // そのため、不必要な通知を避けるために、更新による通知がされるまで、
    // BehaviorSubjectを経由しての通知をしない。
    const startAt = Date.now();
    const query = this.messagesRef(topicId).orderByChild('createdAt').limitToLast(50);
    query.on(
      'child_added',
      (snapshot) => {
        const dto = MessageDto.fromJSON(snapshot.toJSON());
        if (!dto) return;
        messages.push(dto);

        if (behaviorSubject.closed) query.off();
        // 最新の更新が来た時のみ、変更を通知する(古いデータは、この前の処理で通知されている)
        else if (dto.createdAt - startAt > 0) behaviorSubject.next(messages);
      },
      (error) => {
        console.error(error);
        if (!behaviorSubject.closed) behaviorSubject.error(error);
      },
    );

    unsubscribe?.subscribe({
      next: () => {
        if (!behaviorSubject.closed) behaviorSubject.complete();
        query.off('child_added');
      },
      complete: () => {
        if (!behaviorSubject.closed) behaviorSubject.complete();
        query.off('child_added');
      },
    });
  }

  async save(topicId: TopicId, message: MessageEntity): Promise<void> {
    const ref = await this.messageRef(topicId, message.id);
    const dto = MessageDto.from(message);
    await ref.set(dto.toJSON());
  }

  async messageCount(topicId: TopicId): Promise<number> {
    const snapshots = await this.messagesRef(topicId).get();
    return snapshots.numChildren();
  }

  deleteAllMessagesOf(topicId: TopicId): Promise<void> {
    return this.messagesRef(topicId).remove();
  }

  private messagesRef = (topicId: TopicId) => this.database.ref(`/messages/${topicId.value}`);

  // eslint-disable-next-line max-len
  private messageRef = (topicId: TopicId, messageId: MessageId) => this.messagesRef(topicId).child(messageId.value);
}
