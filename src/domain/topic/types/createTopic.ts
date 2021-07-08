import { UserId } from 'src/domain/user/models/userId';
import { Topic } from 'src/domain/topic/models/topic/topic';

export interface ICreateTopic {
  /**
   * {@link Topic}を作成できるのは登録ユーザーのみ。
   * @param title {@link Topic}のタイトル
   * @param description {@link Topic}の説明
   * @param createdBy {@link Topic}の作成者
   * @param thumbnail サムネイル画像
   * @param isPrivate 話題を特定のユーザーのみに表示する
   * @return 作成された{@link Topic}
   * @throws IllegalArgumentException title が {@link TopicTitle} の条件を満たさなかったとき
   * @throws UserNotFoundException 作成者が登録されていないとき
   */
  execute(
    title: string,
    description: string,
    createdBy: UserId,
    thumbnail: File | Blob,
    isPrivate: boolean,
  ): Promise<Topic>;
}
