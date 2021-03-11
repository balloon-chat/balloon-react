import { AddMessage, IAddMessage } from 'src/domain/message/usecases/addMessage';
import { UserId } from 'src/domain/user/models/userId';
import { Observable } from 'rxjs';
import { IObserveMessageData, MessageData, ObserveMessageData } from 'src/domain/message/usecases/observeMessageData';
import { TopicId } from 'src/domain/topic/models/topicId';
import { MessageRepository } from 'src/data/core/message/messageRepository';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { FirebaseMessageDatabase } from 'src/data/firebase/message/messageDatabase';

export class MessageService {
  private readonly addMessageUsecase: IAddMessage;
  private readonly observeMessageDataUsecase: IObserveMessageData;

  constructor(messageRepository: IMessageRepository = new MessageRepository(FirebaseMessageDatabase.instance)) {
    this.addMessageUsecase = new AddMessage(messageRepository);
    this.observeMessageDataUsecase = new ObserveMessageData(messageRepository);
  }

  observeMessageData(topicId: string): Observable<MessageData[]> {
    return this.observeMessageDataUsecase.execute(new TopicId(topicId));
  }

  async sendMessage(message: string, userId: string, topicId: string): Promise<void> {
    await this.addMessageUsecase.execute(message, new UserId(userId), new TopicId(topicId));
  }
}
