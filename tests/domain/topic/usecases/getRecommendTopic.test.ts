import { GetRecommendTopics } from 'src/domain/topic/usecases/getRecommendTopics';
import { FakeMessageRepository } from 'tests/data/message/FakeMessageRepository';
import { FakeTopicRepository } from 'tests/data/topic/fakeTopicRepository';
import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';
import { FakeRecommendTopicRepository } from 'tests/data/topic/fakeRecommendTopicRepository';
import { TopicFactory } from 'src/domain/topic/models/topic';
import { UserName } from 'src/domain/user/models/userName';
import { UserId } from 'src/domain/user/models/userId';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { TopicEntity } from 'src/domain/topic/repository/types/topicEntity';
import { TopicDataFactory } from 'src/domain/topic/models/topicData';
import { RecommendTopicEntity } from 'src/domain/topic/repository/types/recommendTopicEntity';
import { MessageFactory } from 'src/domain/message/models/message';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { MessageEntity } from 'src/domain/message/repository/types/messageEntity';
import { GetTopics } from 'src/domain/topic/usecases/getTopics';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { IGetRecommendTopics } from 'src/domain/topic/types/getRecommendTopics';

const messageRepository = new FakeMessageRepository();
const topicRepository = new FakeTopicRepository();
const recommendTopicRepository = new FakeRecommendTopicRepository();
const userRepository = new FakeUserRepository();

const usecase: IGetRecommendTopics = new GetRecommendTopics(
  new GetTopics(topicRepository, messageRepository, userRepository),
  recommendTopicRepository,
);

const user = new LoginUser(new UserId(), null, new UserName('test'), 'test');

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
    Recommend Topic Repository : pickup=[Topic]
    Message Repository         : Message
    User Repository            : User
   */
  await userRepository.save(user);

  const topic = TopicFactory.create({ title: new TopicTitle('title'), createdBy: user.id, thumbnailUrl: 'url.jpg' });
  await topicRepository.save(TopicEntity.from(topic));

  const message = MessageFactory.create(new MessageBody('test'), user);
  await messageRepository.save(topic.id, MessageEntity.from(message));

  const recommend = new RecommendTopicEntity([topic.id]);
  await recommendTopicRepository.save(recommend);

  /*
  Expected:
     return: [Topic]
   */
  const result = await usecase.execute();
  expect(result).not.toBeUndefined();
  expect(result?.pickups[0]).toStrictEqual(TopicDataFactory.create({
    topic,
    commentCount: 1,
    createdBy: user,
  }));
});

test('おすすめの話題が作成されていないとき', async () => {
  /*
  初期データ:
    Topic Repository           : Topic
    Recommend Topic Repository : null
    Message Repository         : Message
    User Repository            : User
   */
  await userRepository.save(user);

  const topic = TopicFactory.create({ title: new TopicTitle('title'), createdBy: user.id, thumbnailUrl: 'url.jpg' });
  await topicRepository.save(TopicEntity.from(topic));

  const message = MessageFactory.create(new MessageBody('test'), user);
  await messageRepository.save(topic.id, MessageEntity.from(message));

  /*
  Expected:
    return: undefined
   */
  const result = await usecase.execute();
  expect(result)
    .toBeUndefined();
});

test('話題が存在しないとき', async () => {
  /*
  初期データ:
    Topic Repository           : Topic1
    Recommend Topic Repository : pickup=[Topic1, Topic2]
    User Repository            : User
   */
  await userRepository.save(user);

  const topic1 = TopicFactory.create({ title: new TopicTitle('title'), createdBy: user.id, thumbnailUrl: 'url.jpg' });
  const topic2 = TopicFactory.create({ title: new TopicTitle('title'), createdBy: user.id, thumbnailUrl: 'url.jpg' });
  await topicRepository.save(TopicEntity.from(topic1));

  const recommend = new RecommendTopicEntity([topic1.id, topic2.id]);
  await recommendTopicRepository.save(recommend);

  /*
  Expected:
    保存されている話題のみを取得する。
    return: Topic1
   */
  const result = await usecase.execute();
  expect(result).not.toBeUndefined();
  expect(result?.pickups[0]).toStrictEqual(TopicDataFactory.create({
    topic: topic1,
    commentCount: 0,
    createdBy: user,
  }));
});
