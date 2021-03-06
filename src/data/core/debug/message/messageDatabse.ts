import { Observable } from 'rxjs';
import { InMemoryBaseRepository } from 'src/data/core/debug/baseRepository';
import { IMessageDatabase } from 'src/data/core/message/messageDatabase';
import { MessageDto } from 'src/data/core/message/messageDto';

export class InMemoryMessageDatabase implements IMessageDatabase {
  private readonly repository = new InMemoryBaseRepository<string, MessageDto>();

  private constructor() {
  }

  // tslint:disable-next-line:variable-name
  private static _instance: IMessageDatabase;

  static get instance(): IMessageDatabase {
    if (!this._instance) {
      this._instance = new InMemoryMessageDatabase();
    }
    return this._instance;
  }

  find(_: string, messageId: string): Promise<MessageDto | undefined> {
    return this.repository.find(messageId);
  }

  observeAll(_: string): Observable<MessageDto[]> {
    return this.repository.observeAll();
  }

  save(_: string, message: MessageDto): Promise<void> {
    return this.repository.save(message.id, message);
  }

}
