import axios from 'axios';
import { UserEntity, UserEntityFactory } from 'src/view/types/user';
import firebase from 'firebase';
import { UserRepository } from 'src/data/core/user/userRepository';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { FirebaseUserDatabase } from 'src/data/firebase/user/userDatabase';
import { IGetUserByLoginId } from 'src/domain/user/types/getUserByLoginId';
import { GetUserByLoginId } from 'src/domain/user/usecases/getUserByLoginId';

type OauthResult = {
  accessToken: string | null,
  name: string | null,
  photoUrl: string | null,
  newUser: boolean | null,
  authorized: boolean,
};

export class AuthService {
  private readonly getUserByLoginIdUsecase: IGetUserByLoginId;

  constructor(
    userRepository: IUserRepository
    = new UserRepository(FirebaseUserDatabase.instance),
  ) {
    this.getUserByLoginIdUsecase = new GetUserByLoginId(userRepository);
  }

  // eslint-disable-next-line class-methods-use-this
  async getOauthResult(cookie?: string): Promise<OauthResult> {
    const result = await axios.get<{
      accessToken?: string,
      name?: string,
      photoUrl?: string,
      newUser?: boolean
    }>(
      process.env.OAUTH_GOOGLE_LOGIN_RESULT_URL!,
      {
        withCredentials: true,
        headers: {
          cookie: cookie ?? '',
        },
      },
    );

    if (result.status === 401) {
      return {
        accessToken: null,
        name: null,
        photoUrl: null,
        newUser: null,
        authorized: false,
      };
    }

    return {
      accessToken: result.data.accessToken ?? null,
      name: result.data.name ?? null,
      photoUrl: result.data.photoUrl ?? null,
      newUser: result.data.newUser ?? null,
      authorized: result.status === 200,
    };
  }

  /**
   * Firestoreにログインし、セッションを作成する。
   * @param accessToken OAuth認証によって取得したアクセストークン
   */
  async login(accessToken: string): Promise<UserEntity | null> {
    // Firebaseにログイン
    const credential = firebase.auth.GoogleAuthProvider.credential(null, accessToken);
    const result = await firebase.auth()
      .signInWithCredential(credential);
    const { user } = result;
    if (!user) return null;

    // セッションを作成
    return this.createSession(await user.getIdToken(), user.uid);
  }

  async createSession(idToken: string, uid: string): Promise<UserEntity | null> {
    const response = await axios.post(
      process.env.SESSION_LOGIN_API_URL!,
      { idToken },
      { withCredentials: true },
    );

    if (response.status !== 200) {
      return null;
    }

    const loginUser = await this.getUserByLoginIdUsecase.execute(uid);
    if (!loginUser) return null;

    return UserEntityFactory.create(loginUser);
  }

  // eslint-disable-next-line class-methods-use-this
  async logout(): Promise<void> {
    // Firebaseからログアウト
    await firebase.auth().signOut();
    // セッションを削除
    await axios.post(
      process.env.SESSION_LOGOUT_API_URL!,
      {},
      { withCredentials: true },
    );
  }

  // eslint-disable-next-line class-methods-use-this
  async getUserInfo(cookie: string | undefined): Promise<{ loginId: string | undefined }> {
    if (!cookie) return { loginId: undefined };

    try {
      const { data } = await axios.get<{ loginId: string }>(
        process.env.GET_USER_INFO_API_URL!,
        {
          withCredentials: true,
          headers: {
            cookie,
          },
        },
      );

      return { loginId: data.loginId } as const;
    } catch (e) {
      return {
        loginId: undefined,
      };
    }
  }
}
