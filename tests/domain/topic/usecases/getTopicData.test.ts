import { FakeTopicRepository } from 'tests/data/topic/fakeTopicRepository';
import { FakeMessageRepository } from 'tests/data/message/FakeMessageRepository';
import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';
import { GetTopicData } from 'src/domain/topic/usecases/getTopicData';
import { TopicFactory } from 'src/domain/topic/models/topic/topic';
import { TopicTitle } from 'src/domain/topic/models/topic/topicTitle';
import { TopicEntity } from 'src/domain/topic/repository/types/topicEntity';
import { MessageFactory } from 'src/domain/message/models/message';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { MessageEntity } from 'src/domain/message/repository/types/messageEntity';
import { TopicId } from 'src/domain/topic/models/topic/topicId';
import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';
import { AnonymousUser } from 'src/domain/user/models/anonymousUser';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { IGetTopicData } from 'src/domain/topic/types/getTopicData';
import { TopicDataFactory } from 'src/domain/topic/models/topic/topicData';

const topicRepository = new FakeTopicRepository();
const messageRepository = new FakeMessageRepository();
const userRepository = new FakeUserRepository();

const usecase: IGetTopicData = new GetTopicData(
  messageRepository,
  topicRepository,
  userRepository,
);

const thumbnailUrl = 'some.img';
const user = new LoginUser(new UserId(), null, new UserName('test'), 'test');
const topicTitle = new TopicTitle('test');

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
  await userRepository.save(user);

  const topic = TopicFactory.create({ title: topicTitle, createdBy: user.id, thumbnailUrl, description: 'description' });
  await topicRepository.save(TopicEntity.from(topic));

  const message = MessageFactory.create(new MessageBody('test'), user);
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
  expect(results)
    .toBeUndefined();
});

test('作成したユーザーが存在しない場合、取得しない', async () => {
  /*
   初期データ:
     TopicRepository: Topic
     MessageRepository: [],
     UserRepository: null
    */
  const user = new AnonymousUser();

  const topic = TopicFactory.create({ title: topicTitle, createdBy: user.id, thumbnailUrl });
  await topicRepository.save(TopicEntity.from(topic));

  const result = await usecase.execute(topic.id);
  // ユーザー情報がない場合は、そのTopicを取得しない
  expect(result)
    .toBeUndefined();
});

test('プライベートなTopicを取得', async () => {
  /*
   初期データ:
     TopicRepository: Topic(private)
    */
  await userRepository.save(user);

  const privateTopic = TopicFactory.create({
    title: topicTitle,
    createdBy: user.id,
    thumbnailUrl,
    isPrivate: true,
  });
  await topicRepository.save(TopicEntity.from(privateTopic));

  /*
  TopicのIDを知っている場合は、作成者でなくても取得する
  Expected: Topic(private)
   */
  const result = await usecase.execute(privateTopic.id);
  expect(result).toStrictEqual(TopicDataFactory.create({
    topic: privateTopic,
    commentCount: 0,
    createdBy: user,
  }));
});
