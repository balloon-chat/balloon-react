import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userStateName } from 'src/data/redux/user/state';
import { UserService } from 'src/domain/user/service/userService';
import { UserEntity } from 'src/view/types/user';
import { AuthService } from 'src/domain/auth/service/AuthService';

const CREATE_USER = `${userStateName}/create`;
const LOGIN = `${userStateName}/login`;

export const createUser = createAsyncThunk<
  UserEntity,
  {
    loginId: string,
    name: string,
    photo: string | File,
}
>(CREATE_USER, async ({
  loginId,
  name,
  photo,
}) => {
  const service = new UserService();
  return service.createUser(loginId, name, photo);
});

export const login = createAsyncThunk<
  {user: UserEntity | null},
  {loginId?: string, idToken?: string, accessToken?: string}
>(LOGIN, async ({ loginId, idToken, accessToken }) => {
  const service = new AuthService();

  if (accessToken) {
    const user = await service.login(accessToken);
    return { user };
  }

  if (idToken && loginId) {
    const user = await service.createSession(idToken, loginId);
    return { user };
  }

  return { user: null };
});

export type SetUser = PayloadAction<{
  uid: string|null,
  photoUrl: string|null,
  name: string|null
}>
