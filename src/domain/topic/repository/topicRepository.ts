import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { TopicId } from 'src/domain/topic/models/topicId';
import { UserId } from 'src/domain/user/models/userId';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { TopicDescription } from 'src/domain/topic/models/topicDescription';
import { BranchTopicEntity } from 'src/domain/topic/repository/branchTopicEntity';
import { BranchTopic, BranchTopicId } from 'src/domain/topic/models/branchTopic';
import { Observable, Subject } from 'rxjs';

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

  observeTopic(topicId: TopicId, unsubscribe?: Subject<void>): Observable<TopicEntity | null>

  /**
   * {@param topicId}で指定された話題のプロパティを更新
   * @param params undefinedでないプロパティは更新される
   */
  updateTopic(topicId: TopicId, params: UpdateTopicParams): Promise<void>

  save(topic: TopicEntity): Promise<void>

  delete(topicId: TopicId): Promise<void>

  findBranchTopic(
    topicId: TopicId,
    branchTopicId: BranchTopicId
  ): Promise<BranchTopic | null>

  addBranchTopic(topicId: TopicId, branchTopic: BranchTopicEntity): Promise<void>

  deleteBranchTopic(topicId: TopicId, branchTopicId: BranchTopicId): Promise<void>
}

export type UpdateTopicParams = {
  title: TopicTitle | null,
  description: TopicDescription | null,
  thumbnailUrl: string | null,
  isPrivate: boolean | null
};
