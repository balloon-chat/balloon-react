import { IDeriveTopic } from 'src/domain/topic/types/deriveTopic';
import { TopicId } from 'src/domain/topic/models/topicId';
import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { BranchTopic, BranchTopicFactory } from 'src/domain/topic/models/branchTopic';
import { BranchTopicEntity } from 'src/domain/topic/repository/types/branchTopicEntity';

export class DeriveTopic implements IDeriveTopic {
  constructor(private readonly topicRepository: ITopicRepository) {
  }

  async execute(topicId: string, title: string): Promise<BranchTopic> {
    const branchTopic = BranchTopicFactory.create({ title, createdAt: Date.now() });

    await this.topicRepository.addBranchTopic(
      new TopicId(topicId),
      BranchTopicEntity.from(branchTopic),
    );

    return branchTopic;
  }
}
