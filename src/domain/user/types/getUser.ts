import { LoginUser } from 'src/domain/user/models/loginUser';

export interface IGetUser {
  /**
   * 登録ユーザーの公開情報を取得する
   */
  execute(userId: string): Promise<LoginUser | null>
}
