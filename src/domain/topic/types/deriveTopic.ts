import { BranchTopic } from 'src/domain/topic/models/branchTopic';

export interface IDeriveTopic {
  /**
   * ある話題に対して、新しく話題を追加する。
   * @param topicId 派生させるもととなる Topic のID
   * @param title 派生させる話題のタイトル
   */
  execute(topicId: string, title: string): Promise<BranchTopic>
}
