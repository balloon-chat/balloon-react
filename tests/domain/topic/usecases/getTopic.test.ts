import { FakeTopicRepository } from 'tests/data/topic/fakeTopicRepository';
import { FakeMessageRepository } from 'tests/data/message/FakeMessageRepository';
import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';
import { GetTopic, IGetTopic } from 'src/domain/topic/usecases/getTopic';
import { AnonymousUser } from 'src/domain/user/models/user';
import { TopicFactory } from 'src/domain/topic/models/topic';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { MessageFactory } from 'src/domain/message/models/message';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { TopicId } from 'src/domain/topic/models/topicId';

const topicRepository = new FakeTopicRepository();
const messageRepository = new FakeMessageRepository();
const userRepository = new FakeUserRepository();

const usecase: IGetTopic = new GetTopic(messageRepository, topicRepository, userRepository);

afterEach(() => {
  topicRepository.clean();
  messageRepository.clean();
  userRepository.clean();
});

test('Topicに関するデータを取得', async () => {
  /*
  初期データ:
    TopicRepository: Topic
    MessageRepository: [Message],
    UserRepository: User
   */
  const user = new AnonymousUser();
  await userRepository.save(user);

  const topic = new TopicFactory().create(new TopicTitle('test'), user.id, 'description');
  await topicRepository.save(TopicEntity.from(topic));

  const message = new MessageFactory().create(new MessageBody('test'), user);
  await messageRepository.save(topic.id, MessageEntity.from(message));

  const result = await usecase.execute(topic.id);
  expect(result).not.toBeUndefined();
  expect(result?.id).toEqual(topic.id);
  expect(result?.title).toEqual(topic.title);
  expect(result?.description).toEqual(topic.description);
  expect(result?.createdBy).toEqual(user);
  expect(result?.commentCount).toEqual(1);
});

test('保存する前に取得', async () => {
  /*
   初期データ:
     TopicRepository: null
     MessageRepository: [],
     UserRepository: null
    */
  const results = await usecase.execute(new TopicId());
  expect(results).toBeUndefined();
});

test('作成したユーザーが存在しない場合、取得しない', async () => {
  /*
   初期データ:
     TopicRepository: Topic
     MessageRepository: [],
     UserRepository: null
    */
  const user = new AnonymousUser();

  const topic = new TopicFactory().create(new TopicTitle('test'), user.id);
  await topicRepository.save(TopicEntity.from(topic));

  const result = await usecase.execute(topic.id);
  // ユーザー情報がない場合は、そのTopicを取得しない
  expect(result).toBeUndefined();
});
