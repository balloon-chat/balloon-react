import { FakeTopicRepository } from 'tests/data/topic/fakeTopicRepository';
import { FakeInvitationRepository } from 'tests/data/topic/fakeInvitationRepository';
import { IDeleteTopic } from 'src/domain/topic/types/deleteTopic';
import { DeleteTopic } from 'src/domain/topic/usecases/deleteTopic';
import { FakeMessageRepository } from 'tests/data/message/FakeMessageRepository';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';
import { TopicFactory } from 'src/domain/topic/models/topic';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { TopicEntity } from 'src/domain/topic/repository/types/topicEntity';
import { MessageFactory } from 'src/domain/message/models/message';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { MessageEntity } from 'src/domain/message/repository/types/messageEntity';

const topicRepository = new FakeTopicRepository();
const invitationRepository = new FakeInvitationRepository();
const messageRepository = new FakeMessageRepository();
const usecase: IDeleteTopic = new DeleteTopic(
  topicRepository,
  invitationRepository,
  messageRepository,
);

const user = new LoginUser(new UserId(), null, new UserName('test'), 'test');

afterEach(() => {
  topicRepository.clean();
  invitationRepository.clean();
  messageRepository.clean();
});

test('Topicを削除', async () => {
  /*
  初期データ:
    Topic Repository     : Topic
    Message Repository   : [Message]
    Invitation Repository: Invitation
   */
  const topic = TopicFactory.create({
    title: new TopicTitle('test'),
    createdBy: user.id,
    thumbnailUrl: 'test',
  });
  await topicRepository.save(TopicEntity.from(topic));
  const messages = Array(10)
    .fill(0)
    .map((_, i) => MessageFactory.create(
      new MessageBody(`message: ${i}`),
      user,
    ));

  // eslint-disable-next-line no-restricted-syntax
  for (const message of messages) {
    // eslint-disable-next-line no-await-in-loop
    await messageRepository.save(topic.id, MessageEntity.from(message));
  }

  await invitationRepository.createInvitation(topic.id);

  /*
  Expected:
    Topic Repository     : null
    Message Repository   : []
    Invitation Repository: null
   */
  await usecase.execute(topic.id.value);

  expect(await topicRepository.find(topic.id)).toBeNull();
  expect(await messageRepository.findAll(topic.id)).toStrictEqual([]);
  expect(await invitationRepository.findInvitationCodeByTopicId(topic.id)).toBeNull();
});
