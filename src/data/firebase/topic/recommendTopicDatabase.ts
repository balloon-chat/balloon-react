import { RecommendTopicDto } from 'src/data/firebase/topic/types/recommendTopicDto';
import firebase from 'firebase/app';
import 'firebase/database';
import { IRecommendTopicRepository } from 'src/domain/topic/repository/recommendTopicRepository';
import { RecommendTopicEntity } from 'src/domain/topic/repository/types/recommendTopicEntity';

export class FirebaseRecommendTopicDatabase implements IRecommendTopicRepository {
  private constructor(private readonly database = firebase.database()) {}

  private static _instance: IRecommendTopicRepository;

  static get instance(): IRecommendTopicRepository {
    if (!this._instance) { this._instance = new FirebaseRecommendTopicDatabase(); }
    return this._instance;
  }

  // TODO: findAllに変更
  async find(): Promise<RecommendTopicEntity | null> {
    const snapshot = await this.recommendRef().get();
    const dto = RecommendTopicDto.fromJSON(snapshot.toJSON());
    return dto?.toEntity() ?? null;
  }

  private recommendRef = () => this.database.ref('recommend');
}
