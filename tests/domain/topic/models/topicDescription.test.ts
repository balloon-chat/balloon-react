import { TopicDescription } from 'src/domain/topic/models/topic/topicDescription';

test('文字数は50文字以内', () => {
  expect(TopicDescription.require('a'.repeat(50))).toBeTruthy();
  expect(TopicDescription.require('a'.repeat(51))).toBeFalsy();

  expect(TopicDescription.create('a'.repeat(50))).not.toBeUndefined();
  expect(TopicDescription.create('a'.repeat(51))).toBeUndefined();
});

test('空文字ではいけない', () => {
  expect(TopicDescription.require('')).toBeFalsy();
  expect(TopicDescription.create('')).toBeUndefined();
});

test('undefinedから作成', () => {
  expect(TopicDescription.create(undefined)).toBeUndefined();
});
