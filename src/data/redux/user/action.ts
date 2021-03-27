import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userStateName } from 'src/data/redux/user/state';
import { UserService } from 'src/domain/user/service/userService';

export const CREATE_USER = `${userStateName}/create`;
export const createUser = createAsyncThunk<void, { uid: string, name: string | null, photoUrl: string | null }>(
    CREATE_USER,
    async ({ uid, name, photoUrl }) => {
      const service = new UserService();
      await service.createUser(uid, name, photoUrl);
    },
);

export type SetUserId = PayloadAction<string | null>;
export type SetIsUserLoggedIn = PayloadAction<boolean>;
export type SetPhotoUrl = PayloadAction<string | null>;
