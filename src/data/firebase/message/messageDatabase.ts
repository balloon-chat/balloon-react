import { IMessageDatabase } from 'src/data/core/message/messageDatabase';
import { MessageDto } from 'src/data/core/message/messageDto';
import { BehaviorSubject, Observable } from 'rxjs';
import firebase from 'firebase/app';
import 'firebase/database';

export class FirebaseMessageDatabase implements IMessageDatabase {
  private constructor(private readonly database = firebase.database()) {}

  private static _instance: IMessageDatabase;

  static get instance(): IMessageDatabase {
    if (!this._instance) {
      this._instance = new FirebaseMessageDatabase();
    }
    return this._instance;
  }

  async find(
    topicId: string,
    messageId: string,
  ): Promise<MessageDto | undefined> {
    const snapshot = await this.messageRef(topicId, messageId).once('value');
    return MessageDto.fromJSON(snapshot.toJSON());
  }

  observeAll(topicId: string): Observable<MessageDto[]> {
    const behaviorSubject = new BehaviorSubject<MessageDto[]>([]);
    const messages: MessageDto[] = [];

    this.messagesRef(topicId).limitToFirst(50).on(
      'child_added',
      (snapshot) => {
        const dto = MessageDto.fromJSON(snapshot.toJSON());
        if (dto) messages.push(dto);
        if (!behaviorSubject.closed) behaviorSubject.next(messages);
      },
      (error) => {
        if (!behaviorSubject.closed) behaviorSubject.error(error);
      },
    );

    return behaviorSubject.asObservable();
  }

  async save(topicId: string, message: MessageDto): Promise<void> {
    const ref = await this.messageRef(topicId, message.id);
    ref.set(message.toJSON());
  }

  async messageCount(topicId: string): Promise<number> {
    const snapshots = await this.messagesRef(topicId).get();
    return snapshots.numChildren();
  }

  private messagesRef = (topicId: string) => this.database.ref(`/messages/${topicId}`);

  // eslint-disable-next-line max-len
  private messageRef = (topicId: string, messageId: string) => this.messagesRef(topicId).child(messageId);
}
