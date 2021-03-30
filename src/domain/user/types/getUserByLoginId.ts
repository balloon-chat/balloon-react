import { LoginUser } from 'src/domain/user/models/loginUser';

export interface IGetUserByLoginId {
  /**
   * ログイン時に利用するIDからユーザーを取得
   * @param loginId
   */
  execute(loginId: string): Promise<LoginUser|null>
}
