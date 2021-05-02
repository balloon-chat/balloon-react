import { FakeTopicRepository } from 'tests/data/topic/fakeTopicRepository';
import { CreateTopic } from 'src/domain/topic/usecases/createTopic';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';
import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';
import { TopicDescription } from 'src/domain/topic/models/topicDescription';
import { FakeTopicImageRepository } from 'tests/data/topic/fakeTopicImageRepository';
import { AnonymousUser } from 'src/domain/user/models/anonymousUser';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { ICreateTopic } from 'src/domain/topic/types/createTopic';
import { FakeInvitationRepository } from 'tests/data/topic/fakeInvitationRepository';

const topicRepository = new FakeTopicRepository();
const topicImageRepository = new FakeTopicImageRepository();
const userRepository = new FakeUserRepository();
const invitationRepository = new FakeInvitationRepository();
const usecase: ICreateTopic = new CreateTopic(
  topicRepository,
  topicImageRepository,
  userRepository,
  invitationRepository,
);

// Blobの実装がテストで利用できないので、一時的にundefinedを用いる。
const thumbnail: Blob = undefined!;

const user = new LoginUser(new UserId(), null, new UserName('test'), 'test');

afterEach(() => {
  topicRepository.clean();
  userRepository.clean();
  invitationRepository.clean();
});

test('新しいTopicを作成', async () => {
  /*
  初期データ:
    User Repository      : LoginUser
    Topic Repository     : []
    Invitation Repository: []
   */
  await userRepository.save(user);
  const title = 'new topic';
  const description = 'description';

  /*
  Expected:
    return: Topic
    Topic Repository     : [Topic]
    Invitation Repository: Invitation(topicId=Topic.id)
   */
  // 作成されたTopicを返す
  const result = await usecase.execute(title, description, user.id, thumbnail, false);
  expect(result.createdBy).toBe(user.id);
  expect(result.title).toStrictEqual(new TopicTitle(title));
  expect(result.description?.value).toBe(description);

  // Topic Repositoryに保存されている
  const createdTopic = await topicRepository.find(result.id);
  expect(createdTopic).not.toBeUndefined();

  // 招待コードが生成されている
  const createdCode = await invitationRepository.findInvitationCodeByTopicId(result.id);
  expect(createdCode).not.toBeNull();
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
  await expect(usecase.execute('title', 'description', user.id, thumbnail, false))
    .rejects
    .toThrow();
  expect(await topicRepository.findAll()).toStrictEqual([]);
});

test('不正なタイトルでTopicを作成', async () => {
  await userRepository.save(user);

  const title = '';
  await expect(usecase.execute(title, 'description', user.id, thumbnail, false))
    .rejects
    .toThrow();
});

describe('不正な説明文でTopicを作成', () => {
  const title = 'title';

  beforeEach(async () => {
    await userRepository.save(user);
  });

  test('空文字の場合、登録されない', async () => {
    const emptyDescription = '';
    const created = await usecase.execute(title, emptyDescription, user.id, thumbnail, false);
    expect(created.description).toBeUndefined();
    const savedTopic = await topicRepository.find(created.id);
    expect(savedTopic?.description).toBeNull();
  });

  test('文字数が不正な場合、登録されない', async () => {
    const overSizeDescription = 'a'.repeat(TopicDescription.MAX_DESCRIPTION_LENGTH + 1);
    const created = await usecase.execute(title, overSizeDescription, user.id, thumbnail, false);
    expect(created.description).toBeUndefined();
    const savedTopic = await topicRepository.find(created.id);
    expect(savedTopic?.description).toBeNull();
  });
});
