export interface ICreateUser {
  /**
   * ユーザーの公開情報を保存する
   * @param userId ユーザーのID
   * @param name ユーザーの表示名
   * @param thumbnailUrl ユーザーのアイコン画像のURL
   */
  execute(userId: string, name?: string, thumbnailUrl?: string): Promise<void>;
}
