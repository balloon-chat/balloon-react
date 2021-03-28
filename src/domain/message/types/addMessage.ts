import { UserId } from 'src/domain/user/models/userId';
import { TopicId } from 'src/domain/topic/models/topicId';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';

export interface IAddMessage {
  /**
   * 新しくメッセージを作成する。
   * @param message メッセージボディー
   * @param senderId メッセージを作成したユーザーのID
   * @param topicId メッセージの送信先となるTopicのID
   * @return 作成されたメッセージ
   * @throws IllegalArgumentException message が MessageBodyの条件を満たさなかったとき
   */
  execute(
    message: string,
    senderId: UserId,
    topicId: TopicId
  ): Promise<MessageEntity>;
}
