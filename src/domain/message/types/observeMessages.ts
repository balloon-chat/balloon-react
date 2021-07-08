import { TopicId } from 'src/domain/topic/models/topic/topicId';
import { Observable, Subject } from 'rxjs';
import { Message } from 'src/domain/message/models/message';

/**
 * ユーザー情報などメッセージに関する詳細な情報を含むデータを取得
 */
export interface IObserveMessages {
  execute(topicId: TopicId, unsubscribe?: Subject<void>): Observable<Message[]>;
}
