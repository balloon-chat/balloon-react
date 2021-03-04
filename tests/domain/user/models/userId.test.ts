import { UserId } from 'src/domain/user/models/userId';

test('与えられた文字列で初期化される', () => {
  const userId = new UserId('abc');
  expect(userId.value).toEqual('abc');
});

test('ランダムな文字列で初期化される', () => {
  const userId = new UserId();
  expect(userId.value).toBeTruthy();
});
