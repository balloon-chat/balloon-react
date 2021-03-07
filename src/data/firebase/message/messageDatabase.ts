import { IMessageDatabase } from 'src/data/core/message/messageDatabase';
import { MessageDto } from 'src/data/core/message/messageDto';
import { BehaviorSubject, Observable } from 'rxjs';
import firebase from 'firebase';

export class FirebaseMessageDatabase implements IMessageDatabase {
  constructor(
      private readonly database = firebase.database(),
  ) {
  }

  // tslint:disable-next-line:variable-name
  private static _instance: IMessageDatabase;

  static get instance(): IMessageDatabase {
    if (!this._instance) {
      this._instance = new FirebaseMessageDatabase();
    }
    return this._instance;
  }

  async find(roomId: string, messageId: string): Promise<MessageDto | undefined> {
    const snapshot = await this.messageRef(roomId, messageId).once('value');
    return MessageDto.fromJSON(snapshot.toJSON());
  }

  observeAll(roomId: string): Observable<MessageDto[]> {
    const behaviorSubject = new BehaviorSubject<MessageDto[]>([]);
    this.messagesRef(roomId).on(
        'value',
        (snapshots) => {
          const data: MessageDto[] = [];
          snapshots.forEach((snapshot) => {
            const dto = MessageDto.fromJSON(snapshot.toJSON());
            if (dto) data.push(dto);
            if (!behaviorSubject.closed) behaviorSubject.next(data);
          });
        },
        (error) => {
          if (!behaviorSubject.closed) behaviorSubject.error(error);
        });

    return behaviorSubject.asObservable();
  }

  async save(roomId: string, message: MessageDto): Promise<void> {
    const ref = await this.messageRef(roomId, message.id);
    ref.set(message.toJSON());
  }

  private messagesRef = (roomId: string) => this.database.ref(`/messages/${roomId}`);
  private messageRef = (roomId: string, messageId: string) => this.messagesRef(roomId).child(messageId);
}
