import { Topic, TopicFactory } from 'src/domain/topic/models/topic/topic';
import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { TopicTitle } from 'src/domain/topic/models/topic/topicTitle';
import { TopicEntity } from 'src/domain/topic/repository/types/topicEntity';
import { UserId } from 'src/domain/user/models/userId';
import { IllegalArgumentException } from 'src/domain/exceptions/IllegalArgumentException';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { UserNotFoundException } from 'src/domain/exceptions/UserNotFoundException';
import { ITopicImageRepository } from 'src/domain/topic/repository/topicImageRepository';
import { TopicId } from 'src/domain/topic/models/topic/topicId';
import { ICreateTopic } from 'src/domain/topic/types/createTopic';
import { IInvitationRepository } from 'src/domain/topic/repository/invitationRepository';
import { v4 as uuidv4 } from 'uuid';

export class CreateTopic implements ICreateTopic {
  constructor(
    private readonly topicRepository: ITopicRepository,
    private readonly topicImageRepository: ITopicImageRepository,
    private readonly userRepository: IUserRepository,
    private readonly invitationRepository: IInvitationRepository,
  ) {}

  async execute(
    title: string,
    description: string,
    createdBy: UserId,
    thumbnail: File | Blob,
    isPrivate: boolean,
  ): Promise<Topic> {
    if (!(await this.userRepository.find(createdBy))) {
      throw new UserNotFoundException('Only registered user can create topic.');
    }
    if (!TopicTitle.require(title)) {
      throw new IllegalArgumentException(
        'value must satisfy the constraints of TopicTitle',
      );
    }

    const topicTitle = new TopicTitle(title);
    const topicId = new TopicId();

    // サムネイル画像を保存
    const thumbnailUrl = await this.topicImageRepository.save(createdBy, uuidv4(), thumbnail);

    // 話題を保存
    const topic = TopicFactory.create({
      topicId,
      title: topicTitle,
      createdBy,
      thumbnailUrl,
      description,
      isPrivate,
    });
    const entity = TopicEntity.from(topic);
    await this.topicRepository.save(entity);

    // 招待コードを作成
    await this.invitationRepository.createInvitation(topicId);

    return topic;
  }
}
