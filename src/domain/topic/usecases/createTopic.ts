import { Topic, TopicFactory } from 'src/domain/topic/models/topic';
import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { UserId } from 'src/domain/user/models/userId';
import { IllegalArgumentException } from 'src/domain/exceptions/IllegalArgumentException';

export interface ICreateTopic {
  /**
   * @param title {@link Topic}のタイトル
   * @param description {@link Topic}の説明
   * @param createdBy {@link Topic}の作成者
   * @return 作成された{@link Topic}
   * @throws IllegalArgumentException title が {@link TopicTitle} の条件を満たさなかったとき
   */
  execute(title: string, description: string, createdBy: UserId): Promise<Topic>;
}

export class CreateTopic implements ICreateTopic {

  constructor(private readonly topicRepository: ITopicRepository) {
  }

  async execute(title: string, description: string, createdBy: UserId): Promise<Topic> {
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
