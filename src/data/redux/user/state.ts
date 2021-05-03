export const userStateName = 'userState';

export type UserState = {
  uid: string | null
  loginState: LoginState,
  photoUrl: string | null
  name: string | null
};

export const LoginStates = {
  LOGGED_IN: 'LOGGED_IN',

  NOT_LOGGED_IN: 'NOT_LOGGED_IN',

  // ユーザーが登録しているかどうかを確認中
  FINDING: 'FINDING',

  // Googleログインには成功したが、ユーザーが登録されていない
  USER_NOT_FOUND: 'USER_NOT_FOUND',

  // ユーザーを登録中
  CREATING: 'CREATING',

  LOGIN_ERROR: 'LOGIN_ERROR',

  LOGOUT_ERROR: 'LOGOUT_ERROR',
} as const;

type LoginState = typeof LoginStates[keyof typeof LoginStates];
