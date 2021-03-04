import { MessageId } from 'src/domain/message/models/messageId';

test('与えられた文字列で初期化される', () => {
  const messageId = new MessageId('abc');
  expect(messageId.value).toEqual('abc');
});

test('ランダムな文字列で初期化される', () => {
  const messageId = new MessageId();
  expect(messageId.value).toBeTruthy();
});
