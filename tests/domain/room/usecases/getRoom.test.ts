import { FakeRoomRepository } from 'tests/data/room/FakeRoomRepository';
import { FakeMessageRepository } from 'tests/data/message/FakeMessageRepository';
import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';
import { GetRoom, IGetRoom } from 'src/domain/room/usecases/getRoom';
import { AnonymousUser } from 'src/domain/user/models/user';
import { RoomFactory } from 'src/domain/room/models/room';
import { RoomTitle } from 'src/domain/room/models/roomTitle';
import { RoomEntity } from 'src/domain/room/repository/roomEntity';
import { MessageFactory } from 'src/domain/message/models/message';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { RoomId } from 'src/domain/room/models/roomId';

const roomRepository = new FakeRoomRepository();
const messageRepository = new FakeMessageRepository();
const userRepository = new FakeUserRepository();

const usecase: IGetRoom = new GetRoom(messageRepository, roomRepository, userRepository);

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

  const result = await usecase.execute(room.id);
  expect(result).not.toBeUndefined();
  expect(result?.id).toEqual(room.id);
  expect(result?.title).toEqual(room.title);
  expect(result?.description).toEqual(room.description);
  expect(result?.createdBy).toEqual(user);
  expect(result?.commentCount).toEqual(1);
});

test('保存する前に取得', async () => {
  /*
   初期データ:
     RoomRepository: null
     MessageRepository: [],
     UserRepository: null
    */
  const results = await usecase.execute(new RoomId());
  expect(results).toBeUndefined();
});

test('作成したユーザーが存在しない場合、取得しない', async () => {
  /*
   初期データ:
     RoomRepository: Room
     MessageRepository: [],
     UserRepository: null
    */
  const user = new AnonymousUser();

  const room = new RoomFactory().create(new RoomTitle('test'), user.id);
  await roomRepository.save(RoomEntity.from(room));

  const result = await usecase.execute(room.id);
  // ユーザー情報がない場合は、そのRoomを取得しない
  expect(result).toBeUndefined();
});
