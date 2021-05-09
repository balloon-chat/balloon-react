import { LoginUser } from 'src/domain/user/models/loginUser';

export type UpdateProfileParams = {
  name?: string,
  photo?: File
}

export interface IUpdateProfile {
  /**
   * ユーザーのプロフィールを更新する。
   * @param userId  プロフィールを更新するユーザーのID
   * @param loginId プロフィールを更新するユーザーのログインID(検証に用いられる)
   * @param params 更新する値
   */
  execute(userId: string, loginId: string, params: UpdateProfileParams): Promise<LoginUser>;
}
