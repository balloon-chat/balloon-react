import { FakeTopicRepository } from 'tests/data/topic/fakeTopicRepository';
import { TopicFactory } from 'src/domain/topic/models/topic/topic';
import { TopicTitle } from 'src/domain/topic/models/topic/topicTitle';
import { TopicEntity } from 'src/domain/topic/repository/types/topicEntity';
import { TopicId } from 'src/domain/topic/models/topic/topicId';
import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { GetTopic } from 'src/domain/topic/usecases/getTopic';
import { IGetTopic } from 'src/domain/topic/types/getTopic';

const topicRepository = new FakeTopicRepository();

const usecase: IGetTopic = new GetTopic(topicRepository);

const thumbnailUrl = 'some.img';
const user = new LoginUser(new UserId(), null, new UserName('test'), 'test');
const topicTitle = new TopicTitle('test');

afterEach(() => {
  topicRepository.clean();
});

test('Topicに関するデータを取得', async () => {
  /*
  初期データ:
    TopicRepository: Topic
    MessageRepository: [Message],
    UserRepository: User
   */
  const topic = TopicFactory.create({ title: topicTitle, createdBy: user.id, thumbnailUrl, description: 'description' });
  await topicRepository.save(TopicEntity.from(topic));

  const result = await usecase.execute(topic.id);
  expect(result).toStrictEqual(topic);
});

test('保存する前に取得', async () => {
  /*
   初期データ:
     TopicRepository: null
    */
  const results = await usecase.execute(new TopicId());
  expect(results).toBeUndefined();
});

test('プライベートなTopicを取得', async () => {
  /*
   初期データ:
     TopicRepository: Topic(private)
    */
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
  expect(result).toStrictEqual(privateTopic);
});
