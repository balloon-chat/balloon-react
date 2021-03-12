import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { FakeTopicRepository } from 'tests/data/topic/fakeTopicRepository';
import { AnonymousUser } from 'src/domain/user/models/user';
import { CreateTopic, ICreateTopic } from 'src/domain/topic/usecases/createTopic';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';

const topicRepository: ITopicRepository = new FakeTopicRepository();
const userRepository: IUserRepository = new FakeUserRepository();
const usecase: ICreateTopic = new CreateTopic(topicRepository, userRepository);

test('新しいTopicを作成', async () => {
  /*
  初期データ:
    Topic Repository: []
   */
  const user = new AnonymousUser();
  const title = 'new topic';
  const description = 'description';

  /*
  Expected:
    return: Topic
    Topic Repository: [Topic]
   */
  const createdTopic = await usecase.execute(title, description, user.id);
  // 作成されたTopicを返す
  expect(createdTopic.createdBy).toBe(user.id);
  expect(createdTopic.title).toStrictEqual(new TopicTitle(title));
  expect(createdTopic.description?.value).toBe(description);
  // Topic Repositoryに保存されている
  expect(await topicRepository.find(createdTopic.id) !== undefined).toBeTruthy();
});

test('不正なタイトルでTopicを作成', () => {
  const user = new AnonymousUser();
  expect(usecase.execute('', 'description', user.id)).rejects.toThrow();
});

describe('不正な説明文でTopicを作成', () => {
  const user = new AnonymousUser();
  const title = 'title';

  test('空文字の場合、登録されない', async () => {
    const created = await usecase.execute(title, '', user.id);
    expect(created.description).toBeUndefined();
    const savedTopic = await topicRepository.find(created.id);
    expect(savedTopic?.description).toBeUndefined();
  });

  test('文字数が不正な場合、登録されない', async () => {
    const user = new AnonymousUser();
    const title = 'title';

    const created = await usecase.execute(title, 'a'.repeat(51), user.id);
    expect(created.description).toBeUndefined();
    const savedTopic = await topicRepository.find(created.id);
    expect(savedTopic?.description).toBeUndefined();
  });
});
