import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';
import { CreateUser } from 'src/domain/user/usecases/createUser';
import { UserName } from 'src/domain/user/models/userName';
import { UserId } from 'src/domain/user/models/userId';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { ICreateUser } from 'src/domain/user/types/createUser';
import { FakeUserImageRepository } from 'tests/data/user/FakeUserImageRepository';

const userRepository = new FakeUserRepository();
const userImageRepository = new FakeUserImageRepository();
const usecase: ICreateUser = new CreateUser(userRepository, userImageRepository);

beforeEach(() => {
  userRepository.clean();
});

test('ユーザー情報を新規作成', async () => {
  /*
  初期データ:
    User Repository: null
   */
  const loginId = 'test login id';
  const name = 'test name';
  const photoUrl = 'test photo url';
  /*
  Expected:
    return         : 作成されたユーザー
    User Repository: User
   */
  const result = await usecase.execute(loginId, name, photoUrl);
  const expected = new LoginUser(
    result.id,
    loginId,
    new UserName(name),
    photoUrl,
  );
  expect(result).toStrictEqual(expected);
  expect(await userRepository.find(result.id)).toStrictEqual(expected);
});

test('すでにユーザーが存在していた場合、保存されたデータを取得する', async () => {
  /*
  初期データ:
    User Repository: null
   */
  const loginId = 'test';
  const registeredUser = new LoginUser(new UserId(), loginId, new UserName('registered'), 'registered');
  await userRepository.save(registeredUser);

  await usecase.execute(loginId, 'new user', 'new user');

  // すでに登録されていた場合は、データの更新はされない。
  const result = await userRepository.findByLoginId(loginId);
  expect(result).toStrictEqual(registeredUser);
});
