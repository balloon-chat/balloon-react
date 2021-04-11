import { Action, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userStateName } from 'src/data/redux/user/state';
import { UserService } from 'src/domain/user/service/userService';
import { UserEntity } from 'src/view/types/user';
import firebase from 'firebase/app';
import 'firebase/auth';

export const CREATE_USER = `${userStateName}/create`;
export const LOGIN = `${userStateName}/login`;
export const LOGOUT = `${userStateName}/logout`;
export const RESET_USER_STATE = `${userStateName}/reset`;

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
  {userFound: boolean, user: UserEntity | null},
  {loginId: string, token: string}
>(LOGIN, async ({ loginId, token }) => {
  const service = new UserService();
  await service.login(token);
  const user = await service.getUserByLoginId(loginId);
  return {
    userFound: user !== null,
    user,
  } as const;
});

export const logout = createAsyncThunk<{}, void>(LOGOUT, async () => {
  firebase.auth().signOut().then();
  const service = new UserService();
  await service.logout();
  return {} as const;
});

export type SetUser = PayloadAction<{
  uid: string|null,
  photoUrl: string|null,
  name: string|null
}>

export type ResetUserState = Action<typeof RESET_USER_STATE>;
