import { Observable, Subject } from 'rxjs';
import { Topic } from 'src/domain/topic/models/topic/topic';

export interface IObserveTopic {
  /**
   * @param topicId 更新の通知を受け取る話題のID
   * @param unsubscribe 購読停止用のSubject。 complete, nextを呼び出すと停止する。
   */
  execute(topicId: string, unsubscribe?: Subject<void>): Observable<Topic | null>;
}
