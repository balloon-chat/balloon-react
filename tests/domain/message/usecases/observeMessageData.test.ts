import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { FakeMessageRepository } from 'tests/data/message/FakeMessageRepository';
import { IObserveMessageData, MessageData, ObserveMessageData } from 'src/domain/message/usecases/observeMessageData';
import { MessageFactory } from 'src/domain/message/models/message';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { AnonymousUser } from 'src/domain/user/models/user';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { TopicId } from 'src/domain/topic/models/topicId';

const messageRepository: IMessageRepository = new FakeMessageRepository();
const usecase: IObserveMessageData = new ObserveMessageData(messageRepository);

test('MessageDataを取得', async (done) => {
  /*
  初期データ:
    Message Repository: Message
   */
  const topicId = new TopicId();
  const user = new AnonymousUser();
  const message = MessageFactory.create(new MessageBody('message'), user);
  await messageRepository.save(topicId, MessageEntity.from(message));

  usecase.execute(topicId).subscribe(value => {
    const result = value[0];
    expect(result).toStrictEqual(new MessageData(
        message.id,
        message.body,
        user.id,
        message.createdAt,
    ));
    done();
  });
});
