import { FakeDerivedTopicRepository } from 'tests/data/topic/fakeDerivedTopicRepository';
import { IDeriveTopic } from 'src/domain/topic/types/deriveTopic';
import { DeriveTopic } from 'src/domain/topic/usecases/deriveTopic';
import { TopicId } from 'src/domain/topic/models/topicId';
import { DerivedTopicTitle } from 'src/domain/topic/models/derivedTopic';

const deriveTopicRepository = new FakeDerivedTopicRepository();
const usecase: IDeriveTopic = new DeriveTopic(deriveTopicRepository);

afterEach(() => {
  deriveTopicRepository.clean();
});

test('話題を派生', async () => {
  /*
  初期データ:
    DerivedTopicRepository: []
   */
  const topicId = new TopicId();
  const title = new DerivedTopicTitle('test');
  const derivedTopic = await usecase.execute(topicId.value, title.value);

  /*
  Expected:
    DerivedTopicRepository: [DerivedTopic]
    return: DerivedTopic
   */
  expect(derivedTopic.title).toStrictEqual(title);

  const saved = await deriveTopicRepository.find(topicId, derivedTopic.id);
  expect(saved).not.toBeNull();
  expect(saved?.title).toStrictEqual(title);
});
