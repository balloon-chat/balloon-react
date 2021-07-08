import { AddMessage } from 'src/domain/message/usecases/addMessage';
import { UserId } from 'src/domain/user/models/userId';
import { Observable, Subject } from 'rxjs';
import { TopicId } from 'src/domain/topic/models/topicId';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { FirebaseMessageDatabase } from 'src/data/firebase/message/messageDatabase';
import { MessageEntity, MessageEntityFactory } from 'src/view/types/message';
import { ObserveMessages } from 'src/domain/message/usecases/observeMessages';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { FirebaseUserDatabase } from 'src/data/firebase/user/userDatabase';
import { map } from 'rxjs/operators';
import { IObserveMessages } from 'src/domain/message/types/observeMessages';
import { IAddMessage } from 'src/domain/message/types/addMessage';
import { imagePath } from 'src/components/constants/imagePath';

export class MessageService {
  private readonly addMessageUsecase: IAddMessage;

  private readonly observeMessageUsecase: IObserveMessages;

  constructor(
    messageRepository: IMessageRepository
    = FirebaseMessageDatabase.instance,
    userRepository: IUserRepository
    = FirebaseUserDatabase.instance,
  ) {
    this.addMessageUsecase = new AddMessage(messageRepository);
    this.observeMessageUsecase = new ObserveMessages(
      messageRepository,
      userRepository,
    );
  }

  observeMessageData(topicId: string, unsubscribe?: Subject<void>): Observable<MessageEntity[]> {
    return this.observeMessageUsecase
      .execute(new TopicId(topicId), unsubscribe)
      .pipe(
        map((messages) => messages.map((message) => MessageEntityFactory.create(
          message,
          '匿名ユーザー',
          imagePath.character.blue,
        ))),
      );
  }

  async sendMessage(
    message: string,
    userId: string,
    topicId: string,
  ): Promise<void> {
    await this.addMessageUsecase.execute(
      message,
      new UserId(userId),
      new TopicId(topicId),
    );
  }
}
