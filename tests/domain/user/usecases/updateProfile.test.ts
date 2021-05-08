import { UpdateProfile } from 'src/domain/user/usecases/updateProfile';
import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';
import { FakeUserImageRepository } from 'tests/data/user/FakeUserImageRepository';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';
import { UserNotFoundException } from 'src/domain/exceptions/UserNotFoundException';

const userRepository = new FakeUserRepository();
const userImageRepository = new FakeUserImageRepository();
const usecase = new UpdateProfile(userRepository, userImageRepository);
const userId = new UserId('test');
const loginId = 'test-login-id';
const file = undefined! as File;

afterEach(() => {
  userRepository.clean();
});

test('プロフィールを更新', async () => {
  const old = new LoginUser(userId, loginId, new UserName('test'), 'test');
  await userRepository.save(old);

  const newUser = await usecase.execute(userId.value, loginId, { name: 'new', photo: file });
  expect(newUser.name.value).toEqual('new');
});

test('存在しないユーザーのプロフィールを更新', () => {
  expect(usecase.execute('fake', loginId, {}))
    .rejects
    .toThrow(UserNotFoundException);
});

test('ログインIDの値が不正', async () => {
  const user = new LoginUser(userId, loginId, new UserName('test'), 'test');
  await userRepository.save(user);

  expect(usecase.execute(userId.value, 'fake', {}))
    .rejects
    .toThrow(UserNotFoundException);
});
