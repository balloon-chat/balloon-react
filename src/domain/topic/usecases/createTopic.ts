import { Topic, TopicFactory } from 'src/domain/topic/models/topic';
import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { UserId } from 'src/domain/user/models/userId';
import { IllegalArgumentException } from 'src/domain/exceptions/IllegalArgumentException';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { UserNotFoundException } from 'src/domain/exceptions/UserNotFoundException';
import { ITopicImageRepository } from 'src/domain/topic/repository/topicImageRepository';
import { TopicId } from 'src/domain/topic/models/topicId';
import { ICreateTopic } from 'src/domain/topic/types/createTopic';

export class CreateTopic implements ICreateTopic {
  constructor(
    private readonly topicRepository: ITopicRepository,
    private readonly topicImageRepository: ITopicImageRepository,
    private readonly userRepository: IUserRepository,
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
    const thumbnailURL = await this.topicImageRepository.save(
      createdBy,
      topicId.value,
      thumbnail,
    );
    const topic = TopicFactory.create(
      topicTitle,
      createdBy,
      thumbnailURL,
      description,
      isPrivate,
    );
    const entity = TopicEntity.from(topic);
    await this.topicRepository.save(entity);
    return topic;
  }
}
