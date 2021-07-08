import { IDeriveTopic } from 'src/domain/topic/types/deriveTopic';
import { DeriveTopic } from 'src/domain/topic/usecases/deriveTopic';
import { BranchTopicTitle } from 'src/domain/topic/models/branch/branchTopic';
import { FakeTopicRepository } from 'tests/data/topic/fakeTopicRepository';
import { TopicFactory } from 'src/domain/topic/models/topic/topic';
import { UserId } from 'src/domain/user/models/userId';
import { TopicEntity } from 'src/domain/topic/repository/types/topicEntity';

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
    TopicRepository: [Topic(branch=[])]
   */
  await topicRepository.save(TopicEntity.from(topic));

  /*
  Expected:
    TopicRepository: [Topic(branch=[BranchTopic])]
    return: BranchTopic
   */
  const title = new BranchTopicTitle('test');
  const branchTopic = await usecase.execute(topic.id.value, title.value);
  expect(branchTopic.title).toStrictEqual(title);

  const saved = await topicRepository.findBranchTopic(topic.id, branchTopic.id);
  expect(saved).not.toBeNull();
  expect(saved?.title).toStrictEqual(title);
});
