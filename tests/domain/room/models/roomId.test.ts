import { RoomId } from 'src/domain/room/models/roomId';

test('与えられた文字列で初期化される', () => {
  const roomId = new RoomId('abc');
  expect(roomId.value).toEqual('abc');
});

test('ランダムな文字列で初期化される', () => {
  const userId = new RoomId();
  expect(userId.value).toBeTruthy();
});
