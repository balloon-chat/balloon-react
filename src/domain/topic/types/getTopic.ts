import { TopicId } from 'src/domain/topic/models/topic/topicId';
import { Topic } from 'src/domain/topic/models/topic/topic';

/**
 * 話題のタイトル等の情報のみを取得する。
 *
 * プライベートなトピックだった場合でも、IDを知っているなら取得ができる。
 */
export interface IGetTopic {
  execute(topicId: TopicId): Promise<Topic | undefined>;
}
