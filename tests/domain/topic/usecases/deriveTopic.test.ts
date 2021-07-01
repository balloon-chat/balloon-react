import { IDeriveTopic } from 'src/domain/topic/types/deriveTopic';
import { DeriveTopic } from 'src/domain/topic/usecases/deriveTopic';
import { DerivedTopicTitle } from 'src/domain/topic/models/derivedTopic';
import { FakeTopicRepository } from 'tests/data/topic/fakeTopicRepository';
import { TopicFactory } from 'src/domain/topic/models/topic';
import { UserId } from 'src/domain/user/models/userId';
import { TopicEntity } from 'src/domain/topic/repository/topicEntity';

const topicRepository = new FakeTopicRepository();
const topic = TopicFactory.create({
  createdBy: new UserId(),
  thumbnailUrl: '',
  title: 'test',
  isPrivate: false,
});
const usecase: IDeriveTopic = new DeriveTopic(topicRepository);

afterEach(() => {
  topicRepository.clean();
});

test('話題を派生', async () => {
  /*
  初期データ:
    TopicRepository: [Topic(derived=[])]
   */
  await topicRepository.save(TopicEntity.from(topic));

  /*
  Expected:
    TopicRepository: [Topic(derived=[DerivedTopic])]
    return: DerivedTopic
   */
  const title = new DerivedTopicTitle('test');
  const derivedTopic = await usecase.execute(topic.id.value, title.value);
  expect(derivedTopic.title).toStrictEqual(title);

  const saved = await topicRepository.findDerivedTopic(topic.id, derivedTopic.id);
  expect(saved).not.toBeNull();
  expect(saved?.title).toStrictEqual(title);
});
