import { ITopicDatabase } from 'src/data/core/topic/topicDatabase';
import { TopicDto } from 'src/data/core/topic/topicDto';
import firebase from 'firebase';

export class FirebaseTopicDatabase implements ITopicDatabase {
  constructor(
      private readonly database = firebase.database(),
  ) {
  }

  // tslint:disable-next-line:variable-name
  private static _instance: ITopicDatabase;

  static get instance(): ITopicDatabase {
    if (!this._instance) {
      this._instance = new FirebaseTopicDatabase();
    }
    return this._instance;
  }

  async find(topicId: string): Promise<TopicDto | undefined> {
    const snapshot = await this.topicRef(topicId).once('value');
    return TopicDto.fromJSON(snapshot.toJSON());
  }

  async findAll(): Promise<TopicDto[]> {
    const snapshots = await this.topicsRef().once('value');
    const data: TopicDto[] = [];
    snapshots.forEach((snapshot) => {
      const dto = TopicDto.fromJSON(snapshot.toJSON());
      if (dto) data.push(dto);
    });
    return data;
  }

  async findAllSortByCreatedAt(limit: number): Promise<TopicDto[]> {
    const snapshots = await this.topicsRef().orderByChild('createdAt').limitToLast(limit).once('value');
    const data: TopicDto[] = [];
    snapshots.forEach((snapshot) => {
      const dto = TopicDto.fromJSON(snapshot.toJSON());
      if (dto) data.push(dto);
    });
    return data.reverse(); // 降順にする
  }

  async save(topic: TopicDto): Promise<void> {
    const ref = this.topicRef(topic.id);
    await ref.set(topic.toJSON());
  }

  private topicsRef = () => this.database.ref('/topics/');
  private topicRef = (topicId: string) => this.topicsRef().child(topicId);
}
