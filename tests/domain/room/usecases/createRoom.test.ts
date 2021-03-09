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
  const description = 'description';

  /*
  Expected:
    return: Room
    Room Repository: [Room]
   */
  const createdRoom = await usecase.execute(title, description, user.id);
  // 作成されたルームを返す
  expect(createdRoom.createdBy).toBe(user.id);
  expect(createdRoom.title).toStrictEqual(new RoomTitle(title));
  expect(createdRoom.description?.value).toBe(description);
  // Room Repositoryに保存されている
  expect(await roomRepository.find(createdRoom.id) !== undefined).toBeTruthy();
});

test('不正なタイトルでRoomを作成', () => {
  const user = new AnonymousUser();
  expect(usecase.execute('', 'description', user.id)).rejects.toThrow();
});

describe('不正な説明文でRoomを作成', () => {
  const user = new AnonymousUser();
  const title = 'title';

  test('空文字の場合、登録されない', async () => {
    const created = await usecase.execute(title, '', user.id);
    expect(created.description).toBeUndefined();
    const savedRoom = await roomRepository.find(created.id);
    expect(savedRoom?.description).toBeUndefined();
  });

  test('文字数が不正な場合、登録されない', async () => {
    const user = new AnonymousUser();
    const title = 'title';

    const created = await usecase.execute(title, 'a'.repeat(51), user.id);
    expect(created.description).toBeUndefined();
    const savedRoom = await roomRepository.find(created.id);
    expect(savedRoom?.description).toBeUndefined();
  });
});
