import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { FakeMessageRepository } from 'tests/data/message/FakeMessageRepository';
import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';
import { TopicId } from 'src/domain/topic/models/topicId';
import { Message, MessageFactory } from 'src/domain/message/models/message';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { ObserveMessages } from 'src/domain/message/usecases/observeMessages';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';
import { MessageId } from 'src/domain/message/models/messageId';
import { AnonymousUser } from 'src/domain/user/models/anonymousUser';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { IObserveMessages } from 'src/domain/message/types/observeMessages';

const messageRepository: IMessageRepository = new FakeMessageRepository();
const userRepository = new FakeUserRepository();
const usecase: IObserveMessages = new ObserveMessages(messageRepository, userRepository);

const user = new LoginUser(new UserId(), new UserName('test'), 'test');

afterEach(() => {
  (messageRepository as FakeMessageRepository).clean();
  (userRepository as FakeUserRepository).clean();
});

test('ログインユーザーの作成したMessageを取得', async (done) => {
  /*
  初期データ:
    User Repository: User
    Message Repository: MessageEntity(user=User)
   */
  const topicId = new TopicId();
  await userRepository.save(user);

  const message = MessageFactory.create(new MessageBody('Message'), user);
  await messageRepository.save(topicId, MessageEntity.from(message));

  usecase.execute(topicId).subscribe({
    next: async (value) => {
      /*
      Expected:
        Result: Message(body=MessageBody, sender=User)
       */
      const result = value[0];
      if (result) {
        expect(result).toStrictEqual(message);
        done();
      }
    },
  });
});

test('削除されたユーザーからのメッセージを取得', async (done) => {
  /*
  初期データ:
    User Repository: null
    Message Repository: MessageEntity(user=User)
   */
  const topicId = new TopicId();

  const message = MessageFactory.create(new MessageBody('Message'), user);
  await messageRepository.save(topicId, MessageEntity.from(message));

  usecase.execute(topicId).subscribe({
    next: async (value) => {
      /*
      Expected:
        匿名ユーザーとして取得する。
        Result: Message(body=MessageBody, sender=AnonymousUser)
       */
      const result = value[0];
      if (result) {
        expect(result.sender).toStrictEqual(new AnonymousUser(user.id));
        done();
      }
    },
  });
});

test('匿名ユーザーからのメッセージを取得', async (done) => {
  /*
    初期データ:
      User Repository: null
      Message Repository: MessageEntity(user=AnonymousUser)
     */
  const topicId = new TopicId();

  const anonymousUser = new AnonymousUser();
  const message = MessageFactory.create(new MessageBody('test'), anonymousUser);
  await messageRepository.save(topicId, MessageEntity.from(message));

  usecase.execute(topicId).subscribe({
    next: async (value) => {
      /*
      Expected:
        Result: Message(body=MessageBody, sender=AnonymousUser)
       */
      const result = value[0];
      if (result) {
        expect(result).toStrictEqual(message);
        done();
      }
    },
  });
});

test('作成日を降順にして取得', async (done) => {
  const topicId = new TopicId();
  for (let i = 0; i < 50; i += 1) {
    const message = new Message(new MessageId(), new MessageBody('test'), Math.random(), user);
    // eslint-disable-next-line no-await-in-loop
    await messageRepository.save(topicId, MessageEntity.from(message));
  }

  usecase.execute(topicId).subscribe({
    next: async (result) => {
      /*
      Expected:
        Result: Message(body=MessageBody, sender=User)
       */
      if (result.length === 0) return;
      result.forEach((message, index) => {
        if (index === 0) return;
        const previousMessage = result[index - 1];
        expect(message.createdAt >= previousMessage.createdAt);
      });
      done();
    },
  });
});
