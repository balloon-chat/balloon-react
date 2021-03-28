import { TopicId } from 'src/domain/topic/models/topicId';
import { Observable } from 'rxjs';
import { Message } from 'src/domain/message/models/message';

/**
 * ユーザー情報などメッセージに関する詳細な情報を含むデータを取得
 */
export interface IObserveMessages {
  execute(topicId: TopicId): Observable<Message[]>;
}
