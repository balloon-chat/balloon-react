import { UserId } from 'src/domain/user/models/userId';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { FakeMessageRepository } from 'tests/data/message/FakeMessageRepository';
import { AddMessage, IAddMessage } from 'src/domain/message/usecases/addMessage';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { RoomId } from 'src/domain/room/models/roomId';

const messageRepository: IMessageRepository = new FakeMessageRepository();
const usecase: IAddMessage = new AddMessage(messageRepository);

test('メッセージを作成', async () => {
  const roomId = new RoomId();
  const userId = new UserId();
  const body = new MessageBody('hello');
  const newMessage = await usecase.execute(body.value, userId, roomId);

  // メッセージボディーと送信者のIDが反映されている
  expect(newMessage.body).toEqual(body);
  expect(newMessage.senderId).toEqual(userId);
  // MessageRepositoryに保存される
  expect(await messageRepository.find(roomId, newMessage.id)).not.toBeNull();
});

test('不正な値でメセージを作成', async () => {
  await expect(usecase.execute('', new UserId(), new RoomId())).rejects.toThrow();
});
