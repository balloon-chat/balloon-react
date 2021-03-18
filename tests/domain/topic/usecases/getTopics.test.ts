import { FakeTopicRepository } from 'tests/data/topic/fakeTopicRepository';
import { FakeMessageRepository } from 'tests/data/message/FakeMessageRepository';
import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';
import { TopicFactory } from 'src/domain/topic/models/topic';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { AnonymousUser, LoginUser } from 'src/domain/user/models/user';
import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { MessageFactory } from 'src/domain/message/models/message';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { GetTopics, IGetTopics } from 'src/domain/topic/usecases/getTopics';
import { TopicData } from 'src/domain/topic/usecases/types';
import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';

const topicRepository = new FakeTopicRepository();
const messageRepository = new FakeMessageRepository();
const userRepository = new FakeUserRepository();

const usecase: IGetTopics = new GetTopics(messageRepository, topicRepository, userRepository);

const thumbnailUrl = 'some.img';
const user = new LoginUser(new UserId(), new UserName('test'), 'test');

afterEach(() => {
  topicRepository.clean();
  messageRepository.clean();
  userRepository.clean();
});

describe('TopicのIDにより取得', () => {
  test('指定したTopicを取得', async () => {
    /*
    初期データ:
      TopicRepository: Topic x 50
     */
    await userRepository.save(user);

    const topics = [];
    for (let i = 0; i < 50; i += 1) {
      const topic = TopicFactory.create(new TopicTitle('test'), user.id, thumbnailUrl, '');
      await topicRepository.save(TopicEntity.from(topic));
      topics.push(topic);
    }

    const results = await usecase.execute(topics.map(topic => topic.id));
    for (let i = 0; i < topics.length; i += 1) {
      const result = results[i];
      const topic = topics[i];
      const expected: TopicData = {
        id: topic.id,
        title: topic.title,
        description: topic.description,
        createdAt: new Date(topic.createdAt),
        createdBy: user,
        commentCount: 0,
        thumbnailUrl: topic.thumbnailUrl,
      };
      expect(result).toStrictEqual(expected);
    }
  });

  test('保存する前に取得', async () => {
    /*
     初期データ:
       TopicRepository: null
       MessageRepository: [],
       UserRepository: null
      */
    const user = new AnonymousUser();
    const topic = TopicFactory.create(new TopicTitle('test'), user.id, thumbnailUrl);

    const results = await usecase.execute([topic.id]);
    expect(results.length).toEqual(0);
  });

  test('存在しないユーザーによって作成されたTopic', async () => {
    /*
     初期データ:
       TopicRepository: Topic
       UserRepository: null
      */
    // ユーザーの情報を保存しない
    const user = new AnonymousUser();

    const topic = TopicFactory.create(new TopicTitle('test'), user.id, thumbnailUrl);
    await topicRepository.save(TopicEntity.from(topic));

    const results = await usecase.execute([topic.id]);
    // ユーザー情報がない場合は、そのTopicを取得しない
    expect(results.length).toEqual(0);
  });
});

describe('上限を設定して取得', () => {
  test('Topicに関するデータを取得', async () => {
    /*
    初期データ:
      TopicRepository: Topic x 50
      MessageRepository: [Message x 50],
      UserRepository: User
     */
    await userRepository.save(user);

    const topic = TopicFactory.create(new TopicTitle('test'), user.id, thumbnailUrl, 'description');
    await topicRepository.save(TopicEntity.from(topic));

    const message = MessageFactory.create(new MessageBody('test'), user);
    await messageRepository.save(topic.id, MessageEntity.from(message));

    const results = await usecase.execute(50);
    expect(results.length).toEqual(1);
    const result = results[0];

    const expected: TopicData = {
      id: result.id,
      title: result.title,
      description: result.description,
      createdAt: new Date(result.createdAt),
      createdBy: user,
      thumbnailUrl: topic.thumbnailUrl,
      commentCount: 1,
    };
    expect(result).toStrictEqual(expected);
  });

  test('上限以下のTopicを取得', async () => {
    /*
    初期データ:
      TopicRepository: Topic x 50
     */
    await userRepository.save(user);
    const topics = [];
    for (let i = 0; i < 50; i += 1) {
      const topic = TopicFactory.create(new TopicTitle('test'), user.id, thumbnailUrl, '');
      await topicRepository.save(TopicEntity.from(topic));
      topics.push(topic);
    }

    const results = await usecase.execute(10);
    expect(results.length).toEqual(10);
  });

  test('作成日時順に並び替えた状態で取得', async () => {
    await userRepository.save(user);

    const topics = [];
    for (let i = 0; i < 10; i += 1) {
      const createdAt = (Math.random() + 1) * 1000000000000;
      const topic = TopicFactory.create(new TopicTitle('test'), user.id, thumbnailUrl, undefined, createdAt);
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

  test('Topicを保存する前に取得', async () => {
    /*
     初期データ:
       TopicRepository: []
       UserRepository: []
      */
    const results = await usecase.execute(50);
    expect(results.length).toEqual(0);
  });

  test('存在しないユーザーによって作成されたTopic', async () => {
    /*
     初期データ:
       TopicRepository: Topic
       UserRepository: null
      */
    // ユーザーの情報を保存しない
    const user = new AnonymousUser();

    const topic = TopicFactory.create(new TopicTitle('test'), user.id, thumbnailUrl);
    await topicRepository.save(TopicEntity.from(topic));

    const results = await usecase.execute(50);
    // ユーザー情報がない場合は、そのTopicを取得しない
    expect(results.length).toEqual(0);
  });
});
