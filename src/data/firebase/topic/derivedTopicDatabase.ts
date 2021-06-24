import { DerivedTopicId } from 'src/domain/topic/models/derivedTopic';
import { TopicId } from 'src/domain/topic/models/topicId';
import { DerivedTopicEntity } from 'src/domain/topic/repository/derivedTopicEntity';
import { DerivedTopicRepository } from 'src/domain/topic/repository/derivedTopicRepository';
import firebase from 'firebase';
import { DerivedTopicDto } from 'src/data/core/topic/derivedTopicDto';

export class DerivedTopicDatabase implements DerivedTopicRepository {
  private constructor(private readonly database = firebase.firestore()) {
  }

  private static _instance: DerivedTopicRepository;

  static get instance(): DerivedTopicRepository {
    if (!this._instance) {
      this._instance = new DerivedTopicDatabase();
    }
    return this._instance;
  }

  async find(topicId: TopicId, derivedTopicId: DerivedTopicId): Promise<DerivedTopicEntity | null> {
    const snapshot = await this.document(topicId, derivedTopicId).get();
    const dto = DerivedTopicDto.fromJSON(snapshot.data());
    return dto?.toEntity() ?? null;
  }

  async findByTopicId(topicId: TopicId): Promise<DerivedTopicEntity[]> {
    const collection = this.collection(topicId);
    const snapshots = await collection.get();
    return snapshots.docs
      .map((snapshot) => DerivedTopicDto.fromJSON(snapshot.data()))
      .map((dto) => dto?.toEntity())
      .filter<DerivedTopicEntity>((e): e is DerivedTopicEntity => e !== undefined);
  }

  async save(topicId: TopicId, derivedTopic: DerivedTopicEntity): Promise<void> {
    const doc = this.document(topicId, derivedTopic.id);
    const dto = DerivedTopicDto.fromEntity(derivedTopic);
    await doc.set(dto.toJSON());
  }

  async delete(topicId: TopicId, derivedTopicId: DerivedTopicId): Promise<void> {
    const doc = this.document(topicId, derivedTopicId);
    await doc.delete();
  }

  private collection = (
    topicId: TopicId,
  ) => this.database.collection('/topics')
    .doc(topicId.value)
    .collection('derived');

  private document = (
    topicId: TopicId,
    derivedTopicId: DerivedTopicId,
  ) => this.collection(topicId)
    .doc(derivedTopicId.value);
}
