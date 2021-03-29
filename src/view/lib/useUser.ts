import { useEffect, useState } from 'react';
import router from 'next/router';
import firebase from 'firebase';
import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';
import { useDispatch } from 'react-redux';
import { rootPath } from 'src/view/route/pagePath';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { UserEntity, UserEntityFactory } from 'src/view/types/user';
import { setUser as setUserAction } from 'src/data/redux/user/slice';

type UseUserArgument = {
  returnTo: string | null;
};

/**
 * ログイン状態を監視し、未ログイン時はログイン画面に遷移させる。
 * @param returnTo ログイン後にリダイレクトするページ
 */
export const useUser = (
  { returnTo }: UseUserArgument = { returnTo: rootPath.index },
) => {
  const [user, setUser] = useState<UserEntity | null>();
  const dispatcher = useDispatch();

  useEffect(() => {
    const unsubscribe = firebase.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          const name = user.displayName
            ? new UserName(user.displayName)
            : undefined;
          const photoUrl = user.photoURL ?? undefined;
          const loginUser = new LoginUser(new UserId(user.uid), name, photoUrl);
          setUser(UserEntityFactory.create(loginUser));
          dispatcher(setUserAction({
            uid: loginUser.id.value,
            name: loginUser.name?.value ?? null,
            photoUrl: loginUser.photoUrl ?? null,
          }));
        } else {
          setUser(null);
        }
      });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user === null) {
      const query = returnTo ? { return_to: returnTo } : null;
      router
        .push({
          pathname: rootPath.login,
          query,
        })
        .then();
    }
  }, [user]);

  return { user };
};
