import { TopicDto } from 'src/data/firebase/types/topicDto';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { BranchTopicDto } from 'src/data/firebase/types/branchTopicDto';
import { BranchTopicEntity } from 'src/domain/topic/repository/types/branchTopicEntity';
import { ITopicRepository, UpdateTopicParams } from 'src/domain/topic/repository/topicRepository';
import { TopicId } from 'src/domain/topic/models/topicId';
import { BranchTopicId } from 'src/domain/topic/models/branchTopic';
import { TopicEntity } from 'src/domain/topic/repository/types/topicEntity';
import { UserId } from 'src/domain/user/models/userId';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export class FirebaseTopicDatabase implements ITopicRepository {
  private constructor(private readonly database = firebase.firestore()) {
  }

  private static _instance: ITopicRepository;

  static get instance(): ITopicRepository {
    if (!this._instance) { this._instance = new FirebaseTopicDatabase(); }
    return this._instance;
  }

  async getTopicDto(topicId: TopicId): Promise<TopicDto | null> {
    const snapshot = await this.document(topicId).get();
    return TopicDto.fromJSON(snapshot.data() ?? null);
  }

  async getBranchTopicsDto(topicId: TopicId): Promise<BranchTopicDto[]> {
    const snapshots = await this.branchTopicsCollection(topicId).get();
    return snapshots.docs
      .map((snapshot) => BranchTopicDto.fromJSON(snapshot.data() ?? null))
      .filter((e): e is BranchTopicDto => e !== null);
  }

  async find(topicId: TopicId): Promise<TopicEntity | null> {
    const [topicDto, branchTopics] = await Promise.all([
      this.getTopicDto(topicId),
      this.getBranchTopicsDto(topicId),
    ]);

    return topicDto?.toTopicEntity({ branchTopics }) ?? null;
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
      .map((e) => e.toTopicEntity({ branchTopics: [] }));
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
      .map((e) => e.toTopicEntity({ branchTopics: [] }));
  }

  async findAllPublicTopicsOrderByCreatedAt(
    limit: number,
    from?: TopicId,
  ): Promise<TopicEntity[]> {
    const dto = await this.findAllPublicTopicsSortByCreatedAt(limit, from);

    // 派生した話題の詳細については、話題を一覧で表示する分には不要なため、取得しない
    return dto.map((e) => e.toTopicEntity({ branchTopics: [] }));
  }

  observeTopic(topicId: TopicId, unsubscribe?: Subject<void>): Observable<TopicEntity | null> {
    const topicDocument = this.document(topicId);
    const branchTopicCollection = this.branchTopicsCollection(topicId);

    const topicBehaviorSubject = new BehaviorSubject<TopicDto | null>(null);
    const branchTopicBehaviorSubject = new BehaviorSubject<BranchTopicDto[]>([]);

    const behaviorSubject = new BehaviorSubject<TopicEntity | null>(null);

    const funcUnsubscribeTopic = topicDocument.onSnapshot(
      (snapshot) => {
        const data = snapshot.data();
        const dto = TopicDto.fromJSON(data);
        topicBehaviorSubject.next(dto);
      },
    );

    const funcUnsubscribeBranchTopic = branchTopicCollection.onSnapshot(
      (snapshots) => {
        const dto = snapshots.docs.map((snapshot) => {
          const data = snapshot.data();
          return BranchTopicDto.fromJSON(data);
        }).filter((e): e is BranchTopicDto => e != null);
        branchTopicBehaviorSubject.next(dto);
      },
    );

    unsubscribe?.subscribe({
      next: () => {
        if (behaviorSubject.closed) behaviorSubject.complete();
        funcUnsubscribeTopic();
        funcUnsubscribeBranchTopic();
      },
      complete: () => {
        if (behaviorSubject.closed) behaviorSubject.complete();
        funcUnsubscribeTopic();
        funcUnsubscribeBranchTopic();
      },
    });

    return combineLatest([topicBehaviorSubject, branchTopicBehaviorSubject])
      .pipe(
        map((value) => {
          const [topic, branchTopics] = value;
          return topic?.toTopicEntity({ branchTopics }) ?? null;
        }),
      );
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
          title: title?.value ?? data.title,
          description: description?.value ?? data.description,
          thumbnailURL: thumbnailUrl ?? data.thumbnailURL,
          isPrivate: isPrivate ?? data.isPrivate,
        });
      }
    });
  }

  async save(topic: TopicEntity): Promise<void> {
    const topicDocument = this.document(topic.id);
    const topicDto = TopicDto.from(topic);

    await this.database.runTransaction(async (transaction) => {
      await transaction.set(topicDocument, topicDto.toJSON());

      const branchTopicsDto = topic.branchTopics.map((e) => BranchTopicDto.fromEntity(e));
      await Promise.all(
        branchTopicsDto.map(async (e) => {
          const document = this.branchTopicDocument(topic.id, new BranchTopicId(e.id));
          await transaction.set(document, e.toJSON());
        }),
      );
    });
  }

  delete(topicId: TopicId): Promise<void> {
    const document = this.document(topicId);
    return document.delete();
  }

  async findBranchTopic(
    topicId: TopicId,
    branchTopicId: BranchTopicId,
  ): Promise<BranchTopicEntity | null> {
    const document = this.branchTopicDocument(topicId, branchTopicId);
    const snapshot = await document.get();
    const json = snapshot.data();
    if (!json) return null;

    const dto = BranchTopicDto.fromJSON(json);
    if (!dto) return null;

    return dto?.toEntity() ?? undefined;
  }

  async addBranchTopic(topicId: TopicId, branchTopicEntity: BranchTopicEntity): Promise<void> {
    const topicDocument = this.document(topicId);
    const branchTopicDocument = this.branchTopicDocument(topicId, branchTopicEntity.id);
    await this.database.runTransaction(async (transaction) => {
      await transaction.update(topicDocument, {
        branch: firebase.firestore.FieldValue.arrayUnion(branchTopicEntity.id.value),
      });
      const dto = BranchTopicDto.fromEntity(branchTopicEntity);
      await transaction.set(branchTopicDocument, dto.toJSON());
    });
  }

  async deleteBranchTopic(topicId: TopicId, branchTopicId: BranchTopicId): Promise<void> {
    const topicDocument = this.document(topicId);
    const branchTopicDocument = this.branchTopicDocument(topicId, branchTopicId);
    await this.database.runTransaction(async (transaction) => {
      await transaction.update(topicDocument, {
        branch: firebase.firestore.FieldValue.arrayRemove(branchTopicId.value),
      });
      await transaction.delete(branchTopicDocument);
    });
  }

  private collection = () => this.database.collection('/topics');

  private document = (topicId: TopicId) => this.collection().doc(topicId.value);

  private branchTopicsCollection = (topicId: TopicId) => this.document(topicId).collection('/branch');

  // eslint-disable-next-line max-len
  private branchTopicDocument = (topicId: TopicId, branchTopicId: BranchTopicId) => this.branchTopicsCollection(topicId).doc(branchTopicId.value);
}
