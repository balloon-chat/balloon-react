import { IRoomRepository } from 'src/domain/room/repository/roomRepository';
import { FakeRoomRepository } from 'tests/data/room/FakeRoomRepository';
import { AnonymousUser } from 'src/domain/user/models/user';
import { CreateRoom, ICreateRoom } from 'src/domain/room/usecases/createRoom';
import { RoomTitle } from 'src/domain/room/models/roomTitle';

const roomRepository: IRoomRepository = new FakeRoomRepository();
const usecase: ICreateRoom = new CreateRoom(roomRepository);

test('新しいルームを作成', async () => {
  /*
  初期データ:
    Room Repository: []
   */
  const user = new AnonymousUser();
  const title = 'new room';

  /*
  Expected:
    return: Room
    Room Repository: [Room]
   */
  const createdRoom = await usecase.execute(title, user.id);
  // 作成されたルームを返す
  expect(createdRoom.createdBy).toBe(user.id);
  expect(createdRoom.title).toStrictEqual(new RoomTitle(title));
  // Room Repositoryに保存されている
  expect(await roomRepository.find(createdRoom.id) !== undefined).toBeTruthy();
});

test('不正なタイトルでRoomを作成', () => {
  const user = new AnonymousUser();
  expect(usecase.execute('', user.id)).rejects.toThrow();
});
