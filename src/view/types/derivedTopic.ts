import { DerivedTopic } from 'src/domain/topic/models/derivedTopic';

export type DerivedTopicEntity = {
  id: string,
  title: string,
}

export class DerivedTopicEntityFactory {
  static fromDerivedTopic({
    derivedTopic,
  }: {derivedTopic: DerivedTopic}): DerivedTopicEntity {
    return {
      id: derivedTopic.id.value,
      title: derivedTopic.title.value,
    };
  }
}
