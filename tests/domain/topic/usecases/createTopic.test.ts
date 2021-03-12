import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { FakeTopicRepository } from 'tests/data/topic/fakeTopicRepository';
import { AnonymousUser, LoginUser } from 'src/domain/user/models/user';
import { CreateTopic, ICreateTopic } from 'src/domain/topic/usecases/createTopic';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';
import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';
import { TopicDescription } from 'src/domain/topic/models/topicDescription';

const topicRepository: ITopicRepository = new FakeTopicRepository();
const userRepository: IUserRepository = new FakeUserRepository();
const usecase: ICreateTopic = new CreateTopic(topicRepository, userRepository);

afterEach(() => {
  (topicRepository as FakeTopicRepository).clean();
  (userRepository as FakeUserRepository).clean();
});

test('新しいTopicを作成', async () => {
  /*
  初期データ:
    User Repository: LoginUser
    Topic Repository: []
   */
  const user = new LoginUser(new UserId(), new UserName('test'));
  await userRepository.save(user);
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

test('登録されたユーザーのみが作成可能', async () => {
  /*
  初期データ:
    User Repository: null
    Topic Repository: []
   */
  const user = new AnonymousUser();

  /*
  Expected:
    throw UserNotFoundException
    Topic Repository: []
   */
  await expect(usecase.execute('title', 'description', user.id)).rejects.toThrow();
  expect(await topicRepository.findAll()).toStrictEqual([]);
});

test('不正なタイトルでTopicを作成', async () => {
  const user = new LoginUser(new UserId(), new UserName('test'));
  await userRepository.save(user);

  const title = '';
  await expect(usecase.execute(title, 'description', user.id)).rejects.toThrow();
});

describe('不正な説明文でTopicを作成', () => {
  const user = new LoginUser(new UserId(), new UserName('test'));
  const title = 'title';

  beforeEach(async () => {
    await userRepository.save(user);
  });

  test('空文字の場合、登録されない', async () => {
    const emptyDescription = '';
    const created = await usecase.execute(title, emptyDescription, user.id);
    expect(created.description).toBeUndefined();
    const savedTopic = await topicRepository.find(created.id);
    expect(savedTopic?.description).toBeUndefined();
  });

  test('文字数が不正な場合、登録されない', async () => {
    const overSizeDescription = 'a'.repeat(TopicDescription.MAX_DESCRIPTION_LENGTH + 1);
    const created = await usecase.execute(title, overSizeDescription, user.id);
    expect(created.description).toBeUndefined();
    const savedTopic = await topicRepository.find(created.id);
    expect(savedTopic?.description).toBeUndefined();
  });
});
