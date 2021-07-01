import { IDeriveTopic } from 'src/domain/topic/types/deriveTopic';
import { TopicId } from 'src/domain/topic/models/topicId';
import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { DerivedTopic, DerivedTopicFactory } from '../models/derivedTopic';
import { DerivedTopicEntity } from '../repository/derivedTopicEntity';

export class DeriveTopic implements IDeriveTopic {
  constructor(private readonly topicRepository: ITopicRepository) {
  }

  async execute(topicId: string, title: string): Promise<DerivedTopic> {
    const derivedTopic = DerivedTopicFactory.create({ title });

    await this.topicRepository.addDerivedTopic(
      new TopicId(topicId),
      DerivedTopicEntity.from(derivedTopic),
    );

    return derivedTopic;
  }
}
