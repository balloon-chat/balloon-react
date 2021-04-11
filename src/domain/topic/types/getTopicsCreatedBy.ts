import { TopicData } from 'src/domain/topic/models/topicData';

export interface IGetTopicsCreatedBy {
  /**
   * 特定のユーザーが作成した{@link TopicData}の一覧を取得
   * @param createdBy 作成者のID
   * @param loginId 閲覧者のログインID
   */
  execute(createdBy: string, loginId?: string): Promise<TopicData[]>
}
