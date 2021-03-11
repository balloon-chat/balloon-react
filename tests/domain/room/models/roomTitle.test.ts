import { TopicTitle } from 'src/domain/topic/models/topicTitle';

test('文字数は50文字以内', () => {
  expect(TopicTitle.require('a'.repeat(50))).toBeTruthy();
  expect(TopicTitle.require('a'.repeat(51))).toBeFalsy();
});

test('空文字ではいけない', () => {
  expect(TopicTitle.require('')).toBeFalsy();
});
