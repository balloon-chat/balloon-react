import { FakeRoomRepository } from 'tests/data/room/FakeRoomRepository';
import { FakeMessageRepository } from 'tests/data/message/FakeMessageRepository';
import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';
import { RoomFactory } from 'src/domain/room/models/room';
import { RoomTitle } from 'src/domain/room/models/roomTitle';
import { AnonymousUser } from 'src/domain/user/models/user';
import { RoomEntity } from 'src/domain/room/repository/roomEntity';
import { MessageFactory } from 'src/domain/message/models/message';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { GetRooms, IGetRooms } from 'src/domain/room/usecases/getRooms';

const roomRepository = new FakeRoomRepository();
const messageRepository = new FakeMessageRepository();
const userRepository = new FakeUserRepository();

const usecase: IGetRooms = new GetRooms(messageRepository, roomRepository, userRepository);

afterEach(() => {
  roomRepository.clean();
  messageRepository.clean();
  userRepository.clean();
});

test('Roomに関するデータを取得', async () => {
  /*
  初期データ:
    RoomRepository: Room
    MessageRepository: [Message],
    UserRepository: User
   */
  const user = new AnonymousUser();
  await userRepository.save(user);

  const room = new RoomFactory().create(new RoomTitle('test'), user.id, 'description');
  await roomRepository.save(RoomEntity.from(room));

  const message = new MessageFactory().create(new MessageBody('test'), user);
  await messageRepository.save(room.id, MessageEntity.from(message));

  const results = await usecase.execute(50);
  expect(results.length).toEqual(1);
  const result = results[0];
  expect(result.id).toEqual(room.id);
  expect(result.title).toEqual(room.title);
  expect(result.description).toEqual(room.description);
  expect(result.createdBy).toEqual(user);
  expect(result.commentCount).toEqual(1);
});

test('上限以下のRoomを取得', async () => {
  /*
  初期データ:
    RoomRepository: Room x 50
   */
  const user = new AnonymousUser();
  await userRepository.save(user);
  const rooms = [];
  for (let i = 0; i < 50; i += 1) {
    const room = new RoomFactory().create(new RoomTitle('test'), user.id);
    await roomRepository.save(RoomEntity.from(room));
    rooms.push(room);
  }

  const results = await usecase.execute(10);
  expect(results.length).toEqual(10);
});

test('作成日時順に並び替えた状態で取得', async () => {
  const user = new AnonymousUser();
  await userRepository.save(user);

  const rooms = [];
  for (let i = 0; i < 10; i += 1) {
    const createdAt = (Math.random() + 1) * 1000000000000;
    const room = new RoomFactory().create(new RoomTitle('test'), user.id, undefined, createdAt);
    await roomRepository.save(RoomEntity.from(room));
    rooms.push(room);
  }

  const results = await usecase.execute(10);
  const isSortedByCreatedAt = results.every((v, i, data) => {
    if (i === 0) return true;
    const previous = data[i - 1];
    return previous.createdAt >= v.createdAt;
  });
  expect(isSortedByCreatedAt).toBeTruthy();
});

test('保存する前に取得', async () => {
  /*
   初期データ:
     RoomRepository: null
     MessageRepository: [],
     UserRepository: null
    */
  const results = await usecase.execute(50);
  expect(results.length).toEqual(0);
});

test('存在しないユーザーによって作成されたRoom', async () => {
  /*
   初期データ:
     RoomRepository: Room
     MessageRepository: [],
     UserRepository: null
    */
  // ユーザーの情報を保存しない
  const user = new AnonymousUser();

  const room = new RoomFactory().create(new RoomTitle('test'), user.id);
  await roomRepository.save(RoomEntity.from(room));

  const results = await usecase.execute(50);
  // ユーザー情報がない場合は、そのRoomを取得しない
  expect(results.length).toEqual(0);
});
