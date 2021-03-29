import { TopicData } from 'src/domain/topic/models/topicData';

export interface IGetTopicsCreatedBy {
  /**
   * 特定のユーザーが作成した{@link TopicData}の一覧を取得
   * @param userId 作成者のID
   */
  execute(userId: string): Promise<TopicData[]>
}
