export const userStateName = 'userState';

export type UserState = {
  uid: string | null;
  isLoggedIn: boolean;
  photoUrl: string | null;
};
