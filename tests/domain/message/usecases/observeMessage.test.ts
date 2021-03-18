import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { FakeMessageRepository } from 'tests/data/message/FakeMessageRepository';
import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';
import { TopicId } from 'src/domain/topic/models/topicId';
import { LoginUser } from 'src/domain/user/models/user';
import { MessageFactory } from 'src/domain/message/models/message';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { IObserveMessages, ObserveMessages } from 'src/domain/message/usecases/observeMessages';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';

const messageRepository: IMessageRepository = new FakeMessageRepository();
const userRepository = new FakeUserRepository();
const usecase: IObserveMessages = new ObserveMessages(messageRepository, userRepository);

const user = new LoginUser(new UserId(), new UserName('test'), 'test');

afterEach(() => {
  (messageRepository as FakeMessageRepository).clean();
  (userRepository as FakeUserRepository).clean();
});

test('Messageを取得', async (done) => {
  /*
  初期データ:
    User Repository: User
    Message Repository: MessageEntity(body=MessageBody)
   */
  const topicId = new TopicId();
  await userRepository.save(user);
  const message = MessageFactory.create(new MessageBody('Message'), user);
  await messageRepository.save(topicId, MessageEntity.from(message));

  usecase.execute(topicId).subscribe({
    next: async value => {
      /*
      Expected:
        Result: Message(body=MessageBody, sender=User)
       */
      if (value) {
        const result = value[0];
        expect(result).toStrictEqual(message);
        done();
      }
    },
  });
});
