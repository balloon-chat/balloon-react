import { TopicId } from 'src/domain/topic/models/topicId';

test('与えられた文字列で初期化される', () => {
  const topicId = new TopicId('abc');
  expect(topicId.value).toEqual('abc');
});

test('ランダムな文字列で初期化される', () => {
  const userId = new TopicId();
  expect(userId.value).toBeTruthy();
});
