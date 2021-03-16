import { GetRecommendTopics, IGetRecommendTopics } from 'src/domain/topic/usecases/getRecommendTopics';
import { FakeMessageRepository } from 'tests/data/message/FakeMessageRepository';
import { FakeTopicRepository } from 'tests/data/topic/fakeTopicRepository';
import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';
import { FakeRecommendTopicRepository } from 'tests/data/topic/fakeRecommendTopicRepository';
import { TopicFactory } from 'src/domain/topic/models/topic';
import { LoginUser } from 'src/domain/user/models/user';
import { UserName } from 'src/domain/user/models/userName';
import { UserId } from 'src/domain/user/models/userId';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { TopicData } from 'src/domain/topic/usecases/types';
import { RecommendTopicEntity } from 'src/domain/topic/repository/recommendTopicEntity';
import { MessageFactory } from 'src/domain/message/models/message';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { GetTopics } from 'src/domain/topic/usecases/getTopics';

const messageRepository = new FakeMessageRepository();
const topicRepository = new FakeTopicRepository();
const recommendTopicRepository = new FakeRecommendTopicRepository();
const userRepository = new FakeUserRepository();

const usecase: IGetRecommendTopics = new GetRecommendTopics(
    new GetTopics(messageRepository, topicRepository, userRepository),
    recommendTopicRepository,
);

beforeEach(() => {
  messageRepository.clean();
  topicRepository.clean();
  recommendTopicRepository.clean();
  userRepository.clean();
});

test('おすすめの話題を取得する', async () => {
  /*
  初期データ:
    Topic Repository           : Topic
    Recommend Topic Repository : newest=[Topic] pickup=[Topic]
    Message Repository         : Message
    User Repository            : User
   */
  const user = new LoginUser(new UserId(), new UserName('test'));
  await userRepository.save(user);

  const topic = TopicFactory.create(new TopicTitle('title'), user.id, 'url.jpg');
  await topicRepository.save(TopicEntity.from(topic));

  const message = MessageFactory.create(new MessageBody('test'), user);
  await messageRepository.save(topic.id, MessageEntity.from(message));

  const recommend = new RecommendTopicEntity([topic.id], [topic.id]);
  await recommendTopicRepository.save(recommend);

  const result = await usecase.execute();
  expect(result).not.toBeUndefined();
  const expected: TopicData = {
    id: topic.id,
    title: topic.title,
    description: topic.description,
    thumbnailUrl: topic.thumbnailUrl,
    createdAt: new Date(topic.createdAt),
    createdBy: user,
    commentCount: 1,
  };
  expect(result?.pickups[0]).toStrictEqual(expected);
  expect(result?.newest[0]).toStrictEqual(expected);
});

test('おすすめの話題が作成されていないとき', async () => {
  /*
  初期データ:
    Topic Repository           : Topic
    Recommend Topic Repository : null
    Message Repository         : Message
    User Repository            : User
   */
  const user = new LoginUser(new UserId(), new UserName('test'));
  await userRepository.save(user);

  const topic = TopicFactory.create(new TopicTitle('title'), user.id, 'url.jpg');
  await topicRepository.save(TopicEntity.from(topic));

  const message = MessageFactory.create(new MessageBody('test'), user);
  await messageRepository.save(topic.id, MessageEntity.from(message));

  const result = await usecase.execute();
  expect(result).toBeUndefined();
});

test('話題が存在しないとき', async () => {
  /*
  初期データ:
    Topic Repository           : Topic1
    Recommend Topic Repository : newest=[Topic1, Topic2] pickup=[Topic1, Topic2]
    User Repository            : User
   */
  const user = new LoginUser(new UserId(), new UserName('test'));
  await userRepository.save(user);

  const topic1 = TopicFactory.create(new TopicTitle('title'), user.id, 'url.jpg');
  const topic2 = TopicFactory.create(new TopicTitle('title'), user.id, 'url.jpg');
  await topicRepository.save(TopicEntity.from(topic1));

  const recommend = new RecommendTopicEntity([topic1.id, topic2.id], [topic1.id, topic2.id]);
  await recommendTopicRepository.save(recommend);

  const result = await usecase.execute();
  expect(result).not.toBeUndefined();
  // 保存されている話題のみを取得する。
  expect(result?.newest.length).toBe(1);
  expect(result?.pickups.length).toBe(1);
});
