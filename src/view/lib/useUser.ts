import { useEffect, useState } from 'react';
import router from 'next/router';
import { LoginUser } from 'src/domain/user/models/user';
import firebase from 'firebase';
import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';
import { useDispatch } from 'react-redux';
import { setUserId } from 'src/data/redux/user/slice';
import { rootPath } from 'src/pages/pagePath';

type UseUserArgument = {
  returnTo: string | null,
};

/**
 * ログイン状態を監視し、未ログイン時はログイン画面に遷移させる。
 * @param returnTo ログイン後にリダイレクトするページ
 */
export const useUser = ({ returnTo }: UseUserArgument = { returnTo: rootPath.index }) => {
  const [user, setUser] = useState<LoginUser | null>();
  const dispatcher = useDispatch();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // TODO: fix this.
        const loginUser = new LoginUser(new UserId(user.uid), new UserName(user.displayName!), user.photoURL!);
        setUser(loginUser);
        dispatcher(setUserId(loginUser.id.value));
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  },        []);

  useEffect(() => {
    if (user === null) {
      const query = returnTo ? { return_to: returnTo } : null;
      router.push({
        pathname: rootPath.login,
        query,
      }).then();
    }
  },        [user]);

  return { user };
};
