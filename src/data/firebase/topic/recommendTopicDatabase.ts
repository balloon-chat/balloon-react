import { IRecommendTopicDatabase } from 'src/data/core/topic/recommendTopicDatabase';
import { RecommendTopicDto } from 'src/data/core/topic/recommendTopicDto';
import firebase from 'firebase';
import 'firebase/database';

export class FirebaseRecommendTopicDatabase implements IRecommendTopicDatabase {
  private constructor(
      private readonly database = firebase.database(),
  ) {
  }

  // tslint:disable-next-line:variable-name
  private static _instance: IRecommendTopicDatabase;

  static get instance(): IRecommendTopicDatabase {
    if (!this._instance) {
      this._instance = new FirebaseRecommendTopicDatabase();
    }
    return this._instance;
  }

  async find(): Promise<RecommendTopicDto | undefined> {
    const snapshot = await this.recommendRef().get();
    return RecommendTopicDto.fromJSON(snapshot.toJSON());
  }

  private recommendRef = () => this.database.ref('recommend');
}
