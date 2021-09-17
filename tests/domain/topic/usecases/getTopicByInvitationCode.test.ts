import { FakeTopicRepository } from 'tests/data/topic/fakeTopicRepository';
import { FakeMessageRepository } from 'tests/data/message/FakeMessageRepository';
import { FakeUserRepository } from 'tests/data/user/FakeUserRepository';
import { GetTopicData } from 'src/domain/topic/usecases/getTopicData';
import { IGetTopicByInvitationCode } from 'src/domain/topic/types/getTopicByInvitationCode';
import { GetTopicByInvitationCode } from 'src/domain/topic/usecases/getTopicByInvitationCode';
import { FakeInvitationRepository } from 'tests/data/topic/fakeInvitationRepository';
import { TopicFactory } from 'src/domain/topic/models/topic/topic';
import { TopicTitle } from 'src/domain/topic/models/topic/topicTitle';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';
import { TopicEntity } from 'src/domain/topic/repository/types/topicEntity';
import { TopicDataFactory } from 'src/domain/topic/models/topic/topicData';

const topicRepository = new FakeTopicRepository();
const messageRepository = new FakeMessageRepository();
const userRepository = new FakeUserRepository();
const invitationRepository = new FakeInvitationRepository();
const getTopicUsecase = new GetTopicData(
  messageRepository,
  topicRepository,
  userRepository,
);
const usecase: IGetTopicByInvitationCode = new GetTopicByInvitationCode(
  invitationRepository,
  getTopicUsecase,
);

const user = new LoginUser(new UserId(), null, new UserName('test'), 'test');
const title = new TopicTitle('test');
const thumbnailUrl = 'some.img';
const topic = TopicFactory.create({ title, createdBy: user.id, thumbnailUrl });

afterEach(() => {
  topicRepository.clean();
  messageRepository.clean();
  userRepository.clean();
  invitationRepository.clean();
});

describe('招待コードから話題を取得', () => {
  test('話題を取得', async () => {
    /*
    初期データ:
      TopicRepository: Topic
      UserRepository: User
      InvitationRepository: Invitation
     */
    await userRepository.save(user);
    await topicRepository.save(TopicEntity.from(topic));
    const invitation = await invitationRepository.createInvitation(topic.id);

    const result = await usecase.execute(invitation!.code);
    expect(result).not.toBeUndefined();
    expect(result).toStrictEqual(TopicDataFactory.create({
      topic,
      createdBy: user,
      commentCount: 0,
    }));
  });

  test('不正な招待コードから話題を取得', async () => {
    /*
    初期データ:
      TopicRepository: Topic
      UserRepository: User
      InvitationRepository: null
     */
    await userRepository.save(user);
    await topicRepository.save(TopicEntity.from(topic));
    const result = await usecase.execute([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(result).toBeUndefined();
  });
});

describe('文字列の招待コードから、話題を取得', () => {
  test('話題を取得', async () => {
    /*
    初期データ:
      TopicRepository: Topic
      UserRepository: User
      InvitationRepository: Invitation
     */
    await userRepository.save(user);
    await topicRepository.save(TopicEntity.from(topic));
    const invitation = await invitationRepository.createInvitation(topic.id);

    const codeStr = invitation!.code.join('');
    const result = await usecase.execute(codeStr);
    expect(result).not.toBeUndefined();
    expect(result).toStrictEqual(TopicDataFactory.create({
      topic,
      createdBy: user,
      commentCount: 0,
    }));
  });

  test('不正な招待コードから話題を取得', async () => {
    /*
    初期データ:
      TopicRepository: Topic
      UserRepository: User
      InvitationRepository: null
     */
    await userRepository.save(user);
    await topicRepository.save(TopicEntity.from(topic));
    const result = await usecase.execute('01234567');
    expect(result).toBeUndefined();
  });
});
