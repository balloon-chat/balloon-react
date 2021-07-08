import { FakeTopicRepository } from 'tests/data/topic/fakeTopicRepository';
import { FakeTopicImageRepository } from 'tests/data/topic/fakeTopicImageRepository';
import { UpdateTopic } from 'src/domain/topic/usecases/updateTopic';
import { TopicFactory } from 'src/domain/topic/models/topic/topic';
import { TopicTitle } from 'src/domain/topic/models/topic/topicTitle';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';
import { TopicEntity } from 'src/domain/topic/repository/types/topicEntity';

const topicRepository = new FakeTopicRepository();
const topicImageRepository = new FakeTopicImageRepository();
const usecase = new UpdateTopic(topicRepository, topicImageRepository);

afterEach(() => {
  topicRepository.clean();
});

test('話題を更新', async () => {
  /*
  初期データ:
    TopicRepository: Topic(old)
    TopicImageRepository: FileOld
   */
  const user = new LoginUser(new UserId(), null, new UserName('test'), 'thumbnail.jpg');
  const old = TopicFactory.create({
    title: new TopicTitle('old'),
    createdBy: user.id,
    thumbnailUrl: 'old.jpg',
    description: 'old',
    isPrivate: false,
  });
  await topicRepository.save(TopicEntity.from(old));

  /*
  Expected:
    return: Topic(new)
    TopicRepository: Topic(new)
    TopicImageRepository: FileOld
   */
  const updated = await usecase.execute(old.id.value, {
    title: 'new',
    description: 'new',
    thumbnail: undefined! as File,
    isPrivate: true,
  });

  const saved = await topicRepository.find(old.id);
  expect(saved).toStrictEqual(TopicEntity.from(updated));
});

test('存在しない話題を更新', async () => {
  /*
 初期データ:
   TopicRepository: null
  */
  /*
  Expected:
    throw IllegalArgumentException
   */
  await expect(usecase.execute('test', {}))
    .rejects
    .toThrow();
});
