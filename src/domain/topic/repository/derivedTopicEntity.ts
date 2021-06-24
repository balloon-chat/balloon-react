import {
  DerivedTopic,
  DerivedTopicFactory,
  DerivedTopicId,
  DerivedTopicTitle,
} from 'src/domain/topic/models/derivedTopic';

export class DerivedTopicEntity {
  constructor(
    public readonly id: DerivedTopicId,
    public readonly title: DerivedTopicTitle,
  ) {
  }

  static from(derivedTopic: DerivedTopic): DerivedTopicEntity {
    return new DerivedTopicEntity(
      derivedTopic.id,
      derivedTopic.title,
    );
  }

  toDerivedTopic(): DerivedTopic {
    return DerivedTopicFactory.create({
      id: this.id,
      title: this.title.value,
    });
  }
}
