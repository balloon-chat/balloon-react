import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userStateName } from 'src/data/redux/user/state';
import { UserService } from 'src/domain/user/service/userService';
import { UserEntity } from 'src/view/types/user';

export const CREATE_USER = `${userStateName}/create`;
export const LOGIN = `${userStateName}/login`;

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
  {userFound: boolean},
  {loginId: string}
>(LOGIN, async ({ loginId }) => {
  const service = new UserService();
  const user = await service.getUserByLoginId(loginId);
  return {
    userFound: user !== null,
  } as const;
});

export type SetUser = PayloadAction<{
  uid: string|null,
  photoUrl: string|null,
  name: string|null
}>

export type SetIsUserLoggedIn = PayloadAction<boolean>;
export type Logout = PayloadAction<{}>;
