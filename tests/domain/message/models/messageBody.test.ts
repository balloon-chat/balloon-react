import { MessageBody } from 'src/domain/message/models/messageBody';

test('文字数は50文字以内', () => {
  expect(MessageBody.require('a'.repeat(50))).toBeTruthy();
  expect(MessageBody.require('a'.repeat(51))).toBeFalsy();
});

test('空文字ではいけない', () => {
  expect(MessageBody.require('')).toBeFalsy();
});
