import { useEffect, useState } from 'react';
import router from 'next/router';
import firebase from 'firebase';
import { useDispatch } from 'react-redux';
import { rootPath } from 'src/view/route/pagePath';
import { UserEntity } from 'src/view/types/user';
import { setUser as setUserAction } from 'src/data/redux/user/slice';
import { UserService } from 'src/domain/user/service/userService';

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
  const service = new UserService();

  const getUser = async (loginId: string): Promise<UserEntity | null> => {
    const loginUser = await service.getUserByLoginId(loginId);

    if (loginUser) {
      dispatcher(setUserAction({
        uid: loginUser.uid,
        name: loginUser.name,
        photoUrl: loginUser.photoUrl,
      }));
    }

    return loginUser;
  };

  useEffect(() => {
    const unsubscribe = firebase.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          getUser(user.uid)
            .then((loginUser) => setUser(loginUser));
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
