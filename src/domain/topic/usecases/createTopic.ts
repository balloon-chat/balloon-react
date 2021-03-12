import { Topic, TopicFactory } from 'src/domain/topic/models/topic';
import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { UserId } from 'src/domain/user/models/userId';
import { IllegalArgumentException } from 'src/domain/exceptions/IllegalArgumentException';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { UserNotFoundException } from 'src/domain/exceptions/UserNotFoundException';

export interface ICreateTopic {
  /**
   * {@link Topic}を作成できるのは登録ユーザーのみ。
   * @param title {@link Topic}のタイトル
   * @param description {@link Topic}の説明
   * @param createdBy {@link Topic}の作成者
   * @return 作成された{@link Topic}
   * @throws IllegalArgumentException title が {@link TopicTitle} の条件を満たさなかったとき
   * @throws UserNotFoundException 作成者が登録されていないとき
   */
  execute(title: string, description: string, createdBy: UserId): Promise<Topic>;
}

export class CreateTopic implements ICreateTopic {

  constructor(
      private readonly topicRepository: ITopicRepository,
      private readonly userRepository: IUserRepository,
  ) {
  }

  async execute(title: string, description: string, createdBy: UserId): Promise<Topic> {
    if (!await this.userRepository.find(createdBy)) {
      throw new UserNotFoundException('Only registered user can create topic.');
    }
    if (!TopicTitle.require(title)) {
      throw new IllegalArgumentException('value must satisfy the constraints of TopicTitle');
    }

    const topicTitle = new TopicTitle(title);
    const topic = new TopicFactory().create(topicTitle, createdBy, description);
    const entity = TopicEntity.from(topic);
    await this.topicRepository.save(entity);
    return topic;
  }
}
