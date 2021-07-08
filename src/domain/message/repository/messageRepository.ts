import { MessageEntity } from 'src/domain/message/repository/types/messageEntity';
import { MessageId } from 'src/domain/message/models/messageId';
import { TopicId } from 'src/domain/topic/models/topicId';
import { Observable, Subject } from 'rxjs';

export interface IMessageRepository {
  find(
    topicId: TopicId,
    messageId: MessageId
  ): Promise<MessageEntity | null>;

  /**
   * 指定した Topic 内のメッセージの総数を取得
   * @param topicId メッセージ数を調べるTopicのID
   */
  messageCount(topicId: TopicId): Promise<number>;

  observeAll(topicId: TopicId, unsubscribe?: Subject<void>): Observable<MessageEntity[]>;

  save(topicId: TopicId, message: MessageEntity): Promise<void>;

  /**
   * 指定したTopic内のメッセージをすべて削除
   */
  deleteAllMessagesOf(topicId: TopicId): Promise<void>
}
