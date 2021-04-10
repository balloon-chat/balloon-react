import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { TopicId } from 'src/domain/topic/models/topicId';
import { UserId } from 'src/domain/user/models/userId';

export interface ITopicRepository {
  find(topicId: TopicId): Promise<TopicEntity | undefined>;

  /**
   * 公開されている話題の一覧を、作成日順に取得
   * @param limit 取得する最大の項目数
   * @param from 取得する基準となる{@link TopicId}(ページングで用いる)
   */
  findAllPublicTopicsOrderByCreatedAt(
    limit: number,
    from?: TopicId
  ): Promise<TopicEntity[]>;

  /**
   * {@param createdBy}によって指定されたユーザーが作成したTopicの
   * 公開されているTopicのみを取得する。
   * @param createdBy Topic作成者のID
   */
  findAllPublicTopicsCreatedBy(createdBy: UserId): Promise<TopicEntity[]>

  /**
   * {@param createdBy}によって指定されたユーザーが作成したTopicの一覧を
   * 非公開なTopicを含めて取得する。
   * @param createdBy Topic作成者のID
   */
  findAllTopicsCreatedBy(createdBy: UserId): Promise<TopicEntity[]>

  save(topic: TopicEntity): Promise<void>;
}
