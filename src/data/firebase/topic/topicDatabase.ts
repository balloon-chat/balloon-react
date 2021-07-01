import { ITopicDatabase, UpdateTopicParams } from 'src/data/core/topic/topicDatabase';
import { TopicDto } from 'src/data/core/topic/topicDto';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { DerivedTopicDto } from 'src/data/core/topic/derivedTopicDto';
import { DerivedTopicEntity } from 'src/domain/topic/repository/derivedTopicEntity';

export class FirebaseTopicDatabase implements ITopicDatabase {
  private constructor(private readonly database = firebase.firestore()) {
  }

  private static _instance: ITopicDatabase;

  static get instance(): ITopicDatabase {
    if (!this._instance) {
      this._instance = new FirebaseTopicDatabase();
    }
    return this._instance;
  }

  async find(topicId: string): Promise<TopicDto | undefined> {
    const snapshot = await this.document(topicId).get();
    return TopicDto.fromJSON(snapshot.data() ?? null);
  }

  async findAllPublicTopicsSortByCreatedAt(limit: number, from?: string): Promise<TopicDto[]> {
    let query = this.collection()
      .where('isPrivate', '==', false)
      .orderBy('createdAt', 'desc');

    if (from) {
      const snapshot = await this.document(from).get();
      query = query.startAfter(snapshot);
    }
    query = query.limit(limit);

    const snapshots = await query.get();
    return snapshots.docs
      .map((snapshot) => TopicDto.fromJSON(snapshot.data()))
      .filter<TopicDto>((e): e is TopicDto => e !== undefined);
  }

  async findAllPublicTopicsCreatedBy(createdBy: string): Promise<TopicDto[]> {
    const query = this.collection()
      .where('createdBy', '==', createdBy)
      .where('isPrivate', '==', false)
      .orderBy('createdAt', 'desc');

    const snapshots = await query.get();
    return snapshots.docs
      .map((snapshot) => TopicDto.fromJSON(snapshot.data()))
      .filter<TopicDto>((e): e is TopicDto => e !== undefined);
  }

  async findAllTopicsCreatedBy(createdBy: string): Promise<TopicDto[]> {
    const query = this.collection()
      .where('createdBy', '==', createdBy)
      .orderBy('createdAt', 'desc');

    const snapshots = await query.get();
    return snapshots.docs
      .map((snapshot) => TopicDto.fromJSON(snapshot.data()))
      .filter<TopicDto>((e): e is TopicDto => e !== undefined);
  }

  async updateTopic(topicId: string, {
    title,
    description,
    thumbnailUrl,
    isPrivate,
  }: UpdateTopicParams): Promise<void> {
    await this.database.runTransaction(async (transaction) => {
      const topicRef = this.document(topicId);
      const doc = await transaction.get(topicRef);
      const data = TopicDto.fromJSON(doc.data() ?? null);
      if (data) {
        transaction.update(topicRef, {
          title: title ?? data.title,
          description: description ?? data.description,
          thumbnailURL: thumbnailUrl ?? data.thumbnailURL,
          isPrivate: isPrivate ?? data.isPrivate,
        });
      }
    });
  }

  async save(topic: TopicDto): Promise<void> {
    const document = this.document(topic.id);
    await document.set(topic.toJSON());
  }

  delete(topicId: string): Promise<void> {
    const document = this.document(topicId);
    return document.delete();
  }

  async findDerivedTopic(
    topicId: string,
    derivedTopicId: string,
  ): Promise<DerivedTopicEntity | null> {
    const document = this.derivedTopicDocument(topicId, derivedTopicId);
    const snapshot = await document.get();
    const json = snapshot.data();
    if (!json) return null;

    const dto = DerivedTopicDto.fromJSON(json);
    if (!dto) return null;

    return dto?.toEntity() ?? undefined;
  }

  async addDerivedTopic(topicId: string, derivedTopic: DerivedTopicDto): Promise<void> {
    const document = this.derivedTopicDocument(topicId, derivedTopic.id);
    await document.set(derivedTopic.toJSON());
  }

  async deleteDerivedTopic(topicId: string, derivedTopicId: string): Promise<void> {
    const document = this.derivedTopicDocument(topicId, derivedTopicId);
    await document.delete();
  }

  private collection = () => this.database.collection('/topics');

  private document = (topicId: string) => this.collection()
    .doc(topicId);

  private derivedTopicsCollection = (
    topicId: string,
  ) => this.document(topicId)
    .collection('/derive');

  private derivedTopicDocument = (
    topicId: string,
    derivedTopicId: string,
  ) => this.derivedTopicsCollection(topicId)
    .doc(derivedTopicId);
}
