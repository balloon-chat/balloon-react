import { RoomTitle } from 'src/domain/room/models/roomTitle';

test('文字数は50文字以内', () => {
  expect(RoomTitle.require('a'.repeat(50))).toBeTruthy();
  expect(RoomTitle.require('a'.repeat(51))).toBeFalsy();
});

test('空文字ではいけない', () => {
  expect(RoomTitle.require('')).toBeFalsy();
});
