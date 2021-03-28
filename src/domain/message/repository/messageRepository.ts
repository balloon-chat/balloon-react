import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { MessageId } from 'src/domain/message/models/messageId';
import { TopicId } from 'src/domain/topic/models/topicId';
import { Observable } from 'rxjs';

export interface IMessageRepository {
  find(
    topicId: TopicId,
    messageId: MessageId
  ): Promise<MessageEntity | undefined>;

  /**
   * 指定した Topic 内のメッセージの総数を取得
   * @param topicId メッセージ数を調べるTopicのID
   */
  messageCount(topicId: TopicId): Promise<number>;

  observeAll(topicId: TopicId): Observable<MessageEntity[]>;

  save(topicId: TopicId, message: MessageEntity): Promise<void>;
}
