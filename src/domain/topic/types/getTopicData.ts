import { TopicId } from 'src/domain/topic/models/topic/topicId';
import { TopicData } from 'src/domain/topic/models/topic/topicData';

/**
 * 話題のタイトル等の情報だけでなく
 * メッセージ数、作成者情報などの詳細な情報を取得する。
 *
 * プライベートなトピックだった場合でも、IDを知っているなら取得ができる。
 */
export interface IGetTopicData {
  execute(topicId: TopicId): Promise<TopicData | undefined>;
}
