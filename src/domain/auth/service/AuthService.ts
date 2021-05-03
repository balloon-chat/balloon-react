import axios, { AxiosError } from 'axios';
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

export const AuthStates = {
  AUTHORIZED: 'AUTHORIZED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  TIMEOUT: 'TIMEOUT',
  ERROR: 'ERROR',
};

export type AuthState = typeof AuthStates[keyof typeof AuthStates];

const HttpCodes = {
  unauthorized: 401,
  loginTimeout: 440,
} as const;

function isAxiosError(error: any): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}

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
    try {
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

      return {
        accessToken: result.data.accessToken ?? null,
        name: result.data.name ?? null,
        photoUrl: result.data.photoUrl ?? null,
        newUser: result.data.newUser ?? null,
        authorized: result.status === 200,
      };
    } catch (e) {
      return {
        accessToken: null,
        name: null,
        photoUrl: null,
        newUser: null,
        authorized: false,
      } as const;
    }
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
    try {
      await axios.post(
        process.env.SESSION_LOGIN_API_URL!,
        { idToken },
        { withCredentials: true },
      );

      const loginUser = await this.getUserByLoginIdUsecase.execute(uid);
      if (!loginUser) return null;

      return UserEntityFactory.create(loginUser);
    } catch (e) {
      return null;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async logout(): Promise<void> {
    // Firebaseからログアウト
    await firebase.auth().signOut();
    try {
      // セッションを削除
      await axios.post(
        process.env.SESSION_LOGOUT_API_URL!,
        {},
        { withCredentials: true },
      );
    } catch (e) {
      console.error(e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getUserInfo(cookie: string | undefined): Promise<
    { loginId: string | undefined, state: AuthState }
  > {
    if (!cookie) return { loginId: undefined, state: AuthStates.UNAUTHORIZED };

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

      return {
        loginId: data.loginId,
        state: AuthStates.AUTHORIZED,
      } as const;
    } catch (e) {
      if (isAxiosError(e)) {
        let state: AuthState = AuthStates.ERROR;
        if (e.code === `${HttpCodes.unauthorized}`) state = AuthStates.UNAUTHORIZED;
        else if (e.code === `${HttpCodes.loginTimeout}`) state = AuthStates.TIMEOUT;
        return {
          loginId: undefined,
          state,
        };
      }

      return {
        loginId: undefined,
        state: AuthStates.ERROR,
      };
    }
  }
}
