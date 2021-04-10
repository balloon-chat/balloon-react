import { FakeTopicRepository } from 'tests/data/topic/fakeTopicRepository';
import { GetTopic } from 'src/domain/topic/usecases/getTopic';
import { FakeMessageRepository } from 'tests/data/message/FakeMessageRepository';
import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';
import { GetTopicsCreatedBy } from 'src/domain/topic/usecases/getTopicsCreatedBy';
import { IGetTopicsCreatedBy } from 'src/domain/topic/types/getTopicsCreatedBy';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';
import { TopicFactory } from 'src/domain/topic/models/topic';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { TopicData, TopicDataFactory } from 'src/domain/topic/models/topicData';

const messageRepository = new FakeMessageRepository();
const topicRepository = new FakeTopicRepository();
const userRepository = new FakeUserRepository();
const usecase: IGetTopicsCreatedBy = new GetTopicsCreatedBy(
  topicRepository,
  new GetTopic(messageRepository, topicRepository, userRepository),
);

const thumbnailUrl = 'test.user';
const photoUrl = 'test.img';

afterEach(() => {
  topicRepository.clean();
  messageRepository.clean();
  userRepository.clean();
});

test('指定したユーザーが作成したトピックを取得', async () => {
  /*
  初期データ:
    UserRepository : UserA, UserB
    TopicRepository: TopicA(createdBy=UserA), TopicB(createdBy=UserB)
   */
  const userA = new LoginUser(new UserId(), null, new UserName('A'), photoUrl);
  const userB = new LoginUser(new UserId(), null, new UserName('B'), photoUrl);
  await userRepository.save(userA);
  await userRepository.save(userB);

  const topicA = TopicFactory.create(new TopicTitle('A'), userA.id, 'A');
  const topicB = TopicFactory.create(new TopicTitle('B'), userB.id, 'A');
  await topicRepository.save(TopicEntity.from(topicA));
  await topicRepository.save(TopicEntity.from(topicB));

  const results = await usecase.execute(userA.id.value);
  const expected: TopicData = TopicDataFactory.create(
    topicA,
    0,
    userA,
  );
  expect(results)
    .toStrictEqual([expected]);
});

test('作成日順に取得', async () => {
  /*
   初期データ:
     UserRepository : UserA
     TopicRepository: Topic(createdBy=UserA) * 50
    */
  const user = new LoginUser(new UserId(), null, new UserName('Test'), photoUrl);
  await userRepository.save(user);

  for (let i = 0; i < 10; i += 1) {
    const createdAt = (Math.random() + 1) * 1000000000000;
    const topic = TopicFactory.create(new TopicTitle('test'), user.id, 'test', undefined, false, createdAt);
    // eslint-disable-next-line no-await-in-loop
    await topicRepository.save(TopicEntity.from(topic));
  }

  const results = await usecase.execute(user.id.value);
  const isSortedByCreatedAt = results.every((v, i, data) => {
    if (i === 0) return true;
    const previous = data[i - 1];
    return previous.createdAt >= v.createdAt;
  });
  expect(isSortedByCreatedAt)
    .toBeTruthy();
});

describe('プライベートな話題を取得', () => {
  const user = new LoginUser(new UserId(), null, new UserName('Test'), photoUrl);
  const publicTopic = TopicFactory.create(new TopicTitle('test'), user.id, thumbnailUrl, undefined, false);
  const privateTopic = TopicFactory.create(new TopicTitle('test'), user.id, thumbnailUrl, undefined, true);

  test('作成したユーザーが取得', async () => {
    /*
   初期データ:
     UserRepository : UserA
     TopicRepository: [Topic(public, user=UserA), Topic(private, user=UserA)]
    */
    await userRepository.save(user);
    await topicRepository.save(TopicEntity.from(publicTopic));
    await topicRepository.save(TopicEntity.from(privateTopic));

    /*
    閲覧者が作成者の場合のみ、プライベートなTopicが取得される
    Expected:
      return: [Topic(public, user=UserA), Topic(private, user=UserA)]
     */
    const results = await usecase.execute(user.id.value, user.id.value);
    expect(results).toStrictEqual([
      TopicDataFactory.create(publicTopic, 0, user),
      TopicDataFactory.create(privateTopic, 0, user),
    ]);
  });

  test('作成者でないユーザーが取得', async () => {
    /*
      初期データ:
        UserRepository : UserA
        TopicRepository: [Topic(public, user=UserA), Topic(private, user=UserA)]
       */
    await userRepository.save(user);
    await topicRepository.save(TopicEntity.from(publicTopic));
    await topicRepository.save(TopicEntity.from(privateTopic));

    /*
    閲覧者が作成者の場合のみ、プライベートなTopicが取得される
    Expected:
      return: [Topic(public, user=UserA)]
     */
    const results = await usecase.execute(user.id.value, new UserId().value);
    expect(results).toStrictEqual([
      TopicDataFactory.create(publicTopic, 0, user),
    ]);
  });
});
