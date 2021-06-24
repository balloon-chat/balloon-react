import { IDeriveTopic } from 'src/domain/topic/types/deriveTopic';
import { DerivedTopicRepository } from 'src/domain/topic/repository/derivedTopicRepository';
import { TopicId } from 'src/domain/topic/models/topicId';
import { DerivedTopic, DerivedTopicFactory } from '../models/derivedTopic';
import { DerivedTopicEntity } from '../repository/derivedTopicEntity';

export class DeriveTopic implements IDeriveTopic {
  constructor(private readonly derivedTopicRepository: DerivedTopicRepository) {
  }

  async execute(topicId: string, title: string): Promise<DerivedTopic> {
    const derivedTopic = DerivedTopicFactory.create({ title });

    await this.derivedTopicRepository.save(
      new TopicId(topicId),
      DerivedTopicEntity.from(derivedTopic),
    );

    return derivedTopic;
  }
}
