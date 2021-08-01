import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userStateName } from 'src/data/redux/user/state';
import { UserService } from 'src/domain/user/service/userService';
import { UserEntity } from 'src/view/types/user';
import { AuthService } from 'src/domain/auth/service/AuthService';

const CREATE_USER = `${userStateName}/create`;
const LOGIN = `${userStateName}/login`;
const LOGOUT = `${userStateName}/logout`;
const UPDATE_PROFILE = `${userStateName}/update_profile`;

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

export const logout = createAsyncThunk<
  {},
  {}
>(LOGOUT, async () => {
  const service = new AuthService();
  await service.logout();
  return {};
});

export const updateProfile = createAsyncThunk<
  {user: UserEntity},
  {userId: string, loginId: string, name?: string, photo?: File}
>(UPDATE_PROFILE, async ({ userId, loginId, name, photo }) => {
  const service = new UserService();
  const user = await service.updateProfile(userId, loginId, { name, photo });
  return { user };
});

export type SetUser = PayloadAction<{
  uid: string|null,
  photoUrl: string|null,
  name: string|null
}>
