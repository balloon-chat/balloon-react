import { UserId } from 'src/domain/user/models/userId';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { FakeMessageRepository } from 'tests/data/message/FakeMessageRepository';
import { AddMessage } from 'src/domain/message/usecases/addMessage';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { TopicId } from 'src/domain/topic/models/topic/topicId';
import { IAddMessage } from 'src/domain/message/types/addMessage';

const messageRepository: IMessageRepository = new FakeMessageRepository();
const usecase: IAddMessage = new AddMessage(messageRepository);

test('メッセージを作成', async () => {
  const topicId = new TopicId();
  const userId = new UserId();
  const body = new MessageBody('hello');
  const newMessage = await usecase.execute(body.value, userId, topicId);

  // メッセージボディーと送信者のIDが反映されている
  expect(newMessage.body).toEqual(body);
  expect(newMessage.senderId).toEqual(userId);
  // MessageRepositoryに保存される
  expect(await messageRepository.find(topicId, newMessage.id)).not.toBeNull();
});

test('不正な値でメセージを作成', async () => {
  await expect(usecase.execute('', new UserId(), new TopicId())).rejects.toThrow();
});
