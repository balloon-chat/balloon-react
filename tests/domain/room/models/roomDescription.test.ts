import { RoomDescription } from 'src/domain/room/models/roomDescription';

test('文字数は50文字以内', () => {
  expect(RoomDescription.require('a'.repeat(50))).toBeTruthy();
  expect(RoomDescription.require('a'.repeat(51))).toBeFalsy();

  expect(RoomDescription.create('a'.repeat(50))).not.toBeUndefined();
  expect(RoomDescription.create('a'.repeat(51))).toBeUndefined();
});

test('空文字ではいけない', () => {
  expect(RoomDescription.require('')).toBeFalsy();
  expect(RoomDescription.create('')).toBeUndefined();
});

test('undefinedから作成', () => {
  expect(RoomDescription.create(undefined)).toBeUndefined();
});
