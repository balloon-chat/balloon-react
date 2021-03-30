import { LoginUser } from 'src/domain/user/models/loginUser';

export interface ICreateUser {
  /**
   * ユーザーの公開情報を保存する
   * @param loginId ログインに利用されるID(アプリケーション内で利用されるIDとは別)
   * @param name ユーザーの表示名
   * @param photo ユーザーのアイコン画像のURL、または画像ファイル
   * @return 作成されたユーザー
   */
  execute(loginId: string, name: string, photo: string | File): Promise<LoginUser>;
}
