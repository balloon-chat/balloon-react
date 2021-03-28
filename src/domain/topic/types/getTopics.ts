import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicData } from 'src/domain/topic/models/topicData';

export interface IGetTopics {
  /**
   * {@link TopicData}を日付順に並び替えた状態で取得する。
   * @param limit 取得する項目数の上限
   * @param from 取得する基準となる{@link TopicId}
   */
  execute(limit: number, from?: TopicId): Promise<TopicData[]>;

  /**
   * {@link TopicData}の一覧を取得する
   * @param topicsIds 取得する{@link Topic}のID
   */
  execute(topicsIds: TopicId[]): Promise<TopicData[]>;
}
