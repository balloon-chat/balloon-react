import { TopicRepository } from 'tests/data/topic/topicRepository';
import { FakeMessageRepository } from 'tests/data/message/FakeMessageRepository';
import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';
import { TopicFactory } from 'src/domain/topic/models/topic';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { AnonymousUser } from 'src/domain/user/models/user';
import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { MessageFactory } from 'src/domain/message/models/message';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { GetTopics, IGetTopics } from 'src/domain/topic/usecases/getTopics';

const topicRepository = new TopicRepository();
const messageRepository = new FakeMessageRepository();
const userRepository = new FakeUserRepository();

const usecase: IGetTopics = new GetTopics(messageRepository, topicRepository, userRepository);

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

  const results = await usecase.execute(50);
  expect(results.length).toEqual(1);
  const result = results[0];
  expect(result.id).toEqual(topic.id);
  expect(result.title).toEqual(topic.title);
  expect(result.description).toEqual(topic.description);
  expect(result.createdBy).toEqual(user);
  expect(result.commentCount).toEqual(1);
});

test('上限以下のTopicを取得', async () => {
  /*
  初期データ:
    TopicRepository: Topic x 50
   */
  const user = new AnonymousUser();
  await userRepository.save(user);
  const topics = [];
  for (let i = 0; i < 50; i += 1) {
    const topic = new TopicFactory().create(new TopicTitle('test'), user.id);
    await topicRepository.save(TopicEntity.from(topic));
    topics.push(topic);
  }

  const results = await usecase.execute(10);
  expect(results.length).toEqual(10);
});

test('作成日時順に並び替えた状態で取得', async () => {
  const user = new AnonymousUser();
  await userRepository.save(user);

  const topics = [];
  for (let i = 0; i < 10; i += 1) {
    const createdAt = (Math.random() + 1) * 1000000000000;
    const topic = new TopicFactory().create(new TopicTitle('test'), user.id, undefined, createdAt);
    await topicRepository.save(TopicEntity.from(topic));
    topics.push(topic);
  }

  const results = await usecase.execute(10);
  const isSortedByCreatedAt = results.every((v, i, data) => {
    if (i === 0) return true;
    const previous = data[i - 1];
    return previous.createdAt >= v.createdAt;
  });
  expect(isSortedByCreatedAt).toBeTruthy();
});

test('保存する前に取得', async () => {
  /*
   初期データ:
     TopicRepository: null
     MessageRepository: [],
     UserRepository: null
    */
  const results = await usecase.execute(50);
  expect(results.length).toEqual(0);
});

test('存在しないユーザーによって作成されたTopic', async () => {
  /*
   初期データ:
     TopicRepository: Topic
     MessageRepository: [],
     UserRepository: null
    */
  // ユーザーの情報を保存しない
  const user = new AnonymousUser();

  const topic = new TopicFactory().create(new TopicTitle('test'), user.id);
  await topicRepository.save(TopicEntity.from(topic));

  const results = await usecase.execute(50);
  // ユーザー情報がない場合は、そのTopicを取得しない
  expect(results.length).toEqual(0);
});
