export const userStateName = 'userState';

export type UserState = {
  uid: string | null
  loginState: LoginState,
  photoUrl: string | null
  name: string | null
};

export const LoginStates = {
  LOGGED_IN: 'logged in',

  NOT_LOGGED_IN: 'not logged in',

  // ユーザーが登録しているかどうかを確認中
  FINDING: 'checking',

  // Googleログインには成功したが、ユーザーが登録されていない
  USER_NOF_FOUND: 'not found',

  // ユーザーを登録中
  CREATING: 'creating',

  LOGIN_ERROR: 'login_error',

  LOGOUT_ERROR: 'logout_error',
} as const;

type LoginState = typeof LoginStates[keyof typeof LoginStates];
