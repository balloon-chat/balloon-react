import { UniqueId } from 'src/domain/core/uniqueId';

test('与えられた文字列で初期化される', () => {
  const messageId = new UniqueId('abc');
  expect(messageId.value).toEqual('abc');
});

test('ランダムな文字列で初期化される', () => {
  const id = new UniqueId();
  expect(id.value).toBeTruthy();
});

test('空文字の場合、IllegalArgumentException', () => {
  expect(() => new UniqueId('')).toThrowError();
  expect(() => new UniqueId('   ')).toThrowError();
});
