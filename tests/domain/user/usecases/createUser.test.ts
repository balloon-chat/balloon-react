import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';
import { CreateUser, ICreateUser } from 'src/domain/user/usecases/createUser';
import { LoginUser } from 'src/domain/user/models/user';
import { UserName } from 'src/domain/user/models/userName';
import { UserId } from 'src/domain/user/models/userId';

const userRepository = new FakeUserRepository();

const usecase: ICreateUser = new CreateUser(userRepository);

beforeEach(() => {
  userRepository.clean();
});

test('ユーザー情報を新規作成', async () => {
  /*
  初期データ:
    User Repository: null
   */
  const user = new LoginUser(new UserId(), new UserName('test'), 'test');
  await usecase.execute(user.id.value, user.name?.value, user.photoUrl);
  /*
  Expected:
    User Repository: User
   */
  const result = await userRepository.find(user.id);
  expect(result).toStrictEqual(user);
});

test('すでに存在しているユーザーに対して、作成処理をする。', async () => {
  /*
  初期データ:
    User Repository: null
   */
  const userId = new UserId();

  const registeredUser = new LoginUser(userId, new UserName('registered'), 'registered');
  await userRepository.save(registeredUser);

  await usecase.execute(userId.value, 'new user', 'new user');

  // すでに登録されていた場合は、何もしない。
  const result = await userRepository.find(userId);
  expect(result).toStrictEqual(registeredUser);
});
