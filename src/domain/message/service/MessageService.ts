import { AddMessage, IAddMessage } from 'src/domain/message/usecases/addMessage';
import { UserId } from 'src/domain/user/models/userId';
import { InMemoryMessageDatabase } from 'src/data/debug/message/messageDatabse';
import { Observable } from 'rxjs';
import { IObserveMessageData, MessageData, ObserveMessageData } from 'src/domain/message/usecases/observeMessageData';
import { RoomId } from 'src/domain/room/models/roomId';
import { MessageRepository } from 'src/data/core/message/messageRepository';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';

export class MessageService {
  private readonly addMessageUsecase: IAddMessage;
  private readonly observeMessageDataUsecase: IObserveMessageData;

  constructor(messageRepository: IMessageRepository = new MessageRepository(InMemoryMessageDatabase.instance)) {
    this.addMessageUsecase = new AddMessage(messageRepository);
    this.observeMessageDataUsecase = new ObserveMessageData(messageRepository);
  }

  observeMessageData(roomId: string): Observable<MessageData[]> {
    return this.observeMessageDataUsecase.execute(new RoomId(roomId));
  }

  async sendMessage(message: string, userId: string, roomId: string): Promise<void> {
    await this.addMessageUsecase.execute(message, new UserId(userId), new RoomId(roomId));
  }
}
