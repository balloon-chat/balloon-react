import { MessageDto } from 'src/data/firebase/message/types/messageDto';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import firebase from 'firebase/app';
import 'firebase/database';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { TopicId } from 'src/domain/topic/models/topicId';
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
    const messages: MessageDto[] = [];

    const query = this.messagesRef(topicId).limitToFirst(50);
    query.on(
      'child_added',
      (snapshot) => {
        const dto = MessageDto.fromJSON(snapshot.toJSON());
        if (dto) messages.push(dto);

        if (behaviorSubject.closed) query.off();
        else behaviorSubject.next(messages);
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

    return behaviorSubject.pipe(
      map((messages) => messages.map((e) => e.toEntity())),
    );
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
