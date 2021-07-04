import { TopicDto } from 'src/data/firebase/types/topicDto';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { DerivedTopicDto } from 'src/data/firebase/types/derivedTopicDto';
import { DerivedTopicEntity } from 'src/domain/topic/repository/derivedTopicEntity';
import { ITopicRepository, UpdateTopicParams } from 'src/domain/topic/repository/topicRepository';
import { TopicId } from 'src/domain/topic/models/topicId';
import { DerivedTopicId } from 'src/domain/topic/models/derivedTopic';
import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { UserId } from 'src/domain/user/models/userId';

export class FirebaseTopicDatabase implements ITopicRepository {
  private constructor(private readonly database = firebase.firestore()) {
  }

  private static _instance: ITopicRepository;

  static get instance(): ITopicRepository {
    if (!this._instance) {
      this._instance = new FirebaseTopicDatabase();
    }
    return this._instance;
  }

  async getTopicDto(topicId: TopicId): Promise<TopicDto|null> {
    const snapshot = await this.document(topicId).get();
    return TopicDto.fromJSON(snapshot.data() ?? null);
  }

  async getDerivedTopicsDto(topicId: TopicId): Promise<DerivedTopicDto[]> {
    const snapshots = await this.derivedTopicsCollection(topicId).get();
    return snapshots.docs
      .map((snapshot) => DerivedTopicDto.fromJSON(snapshot.data() ?? null))
      .filter((e): e is DerivedTopicDto => e !== null);
  }

  async find(topicId: TopicId): Promise<TopicEntity | undefined> {
    const [topicDto, derivedTopicsDto] = await Promise.all([
      this.getTopicDto(topicId),
      this.getDerivedTopicsDto(topicId),
    ]);
    if (!topicDto) return undefined;

    return topicDto.toTopicEntity({ derivedTopics: derivedTopicsDto });
  }

  async findAllPublicTopicsSortByCreatedAt(limit: number, from?: TopicId): Promise<TopicDto[]> {
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

  async findAllPublicTopicsCreatedBy(createdBy: UserId): Promise<TopicEntity[]> {
    const query = this.collection()
      .where('createdBy', '==', createdBy.value)
      .where('isPrivate', '==', false)
      .orderBy('createdAt', 'desc');

    const snapshots = await query.get();

    // 派生した話題の詳細については、話題を一覧で表示する分には不要なため、取得しない
    return snapshots.docs
      .map((snapshot) => TopicDto.fromJSON(snapshot.data()))
      .filter<TopicDto>((e): e is TopicDto => e !== undefined)
      .map((e) => e.toTopicEntity({ derivedTopics: [] }));
  }

  async findAllTopicsCreatedBy(createdBy: UserId): Promise<TopicEntity[]> {
    const query = this.collection()
      .where('createdBy', '==', createdBy.value)
      .orderBy('createdAt', 'desc');

    const snapshots = await query.get();

    // 派生した話題の詳細については、話題を一覧で表示する分には不要なため、取得しない
    return snapshots.docs
      .map((snapshot) => TopicDto.fromJSON(snapshot.data()))
      .filter<TopicDto>((e): e is TopicDto => e !== undefined)
      .map((e) => e.toTopicEntity({ derivedTopics: [] }));
  }

  async findAllPublicTopicsOrderByCreatedAt(
    limit: number,
    from?: TopicId,
  ): Promise<TopicEntity[]> {
    const dto = await this.findAllPublicTopicsSortByCreatedAt(limit, from);

    // 派生した話題の詳細については、話題を一覧で表示する分には不要なため、取得しない
    return dto.map((e) => e.toTopicEntity({ derivedTopics: [] }));
  }

  async updateTopic(topicId: TopicId, {
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

  async save(topic: TopicEntity): Promise<void> {
    const document = this.document(topic.id);
    const topicDto = TopicDto.from(topic);
    await document.set(topicDto.toJSON());

    const derivedTopicDto = topic.derivedTopics.map((e) => DerivedTopicDto.fromEntity(e));
    await Promise.all(
      derivedTopicDto.map((e) => document.set(e.toJSON())),
    );
  }

  delete(topicId: TopicId): Promise<void> {
    const document = this.document(topicId);
    return document.delete();
  }

  async findDerivedTopic(
    topicId: TopicId,
    derivedTopicId: DerivedTopicId,
  ): Promise<DerivedTopicEntity | null> {
    const document = this.derivedTopicDocument(topicId, derivedTopicId);
    const snapshot = await document.get();
    const json = snapshot.data();
    if (!json) return null;

    const dto = DerivedTopicDto.fromJSON(json);
    if (!dto) return null;

    return dto?.toEntity() ?? undefined;
  }

  async addDerivedTopic(topicId: TopicId, derivedTopic: DerivedTopicEntity): Promise<void> {
    const document = this.derivedTopicDocument(topicId, derivedTopic.id);
    const dto = DerivedTopicDto.fromEntity(derivedTopic);
    await document.set(dto.toJSON());
  }

  async deleteDerivedTopic(topicId: TopicId, derivedTopicId: DerivedTopicId): Promise<void> {
    const document = this.derivedTopicDocument(topicId, derivedTopicId);
    await document.delete();
  }

  private collection = () => this.database.collection('/topics');

  private document = (topicId: TopicId) => this.collection()
    .doc(topicId.value);

  private derivedTopicsCollection = (
    topicId: TopicId,
  ) => this.document(topicId)
    .collection('/derive');

  private derivedTopicDocument = (
    topicId: TopicId,
    derivedTopicId: DerivedTopicId,
  ) => this.derivedTopicsCollection(topicId)
    .doc(derivedTopicId.value);
}
