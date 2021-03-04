import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { FakeMessageRepository } from 'tests/data/message/FakeMessageRepository';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';
import { RoomId } from 'src/domain/room/models/roomId';
import { AnonymousUser } from 'src/domain/user/models/user';
import { MessageFactory } from 'src/domain/message/models/message';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { MessageEntityFactory } from 'src/domain/message/repository/messageEntity';
import { IObserveMessages, ObserveMessages } from 'src/domain/message/usecases/observeMessages';

const messageRepository: IMessageRepository = new FakeMessageRepository();
const userRepository: IUserRepository = new FakeUserRepository();
const usecase: IObserveMessages = new ObserveMessages(messageRepository, userRepository);

test('Messageを取得', async (done) => {
  /*
  初期データ:
    User Repository: User
    Message Repository: MessageEntity(body=MessageBody)
   */
  const user = new AnonymousUser();
  (userRepository as FakeUserRepository).save(user);
  const message = new MessageFactory().create(new MessageBody('Message'), user);
  await messageRepository.save(new MessageEntityFactory().createFromMessage(message));

  usecase.execute(new RoomId()).subscribe({
    next: async value => {
      /*
      Expected:
        Result: Message(body=MessageBody, sender=User)
       */
      const result = value[0];
      expect(result).toStrictEqual(message);
      done();
    },
  });
});
