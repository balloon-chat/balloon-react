import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { setIsUserLoggedIn, setUser } from 'src/data/redux/user/slice';
import { UserService } from 'src/domain/user/service/userService';

export const AuthProvider: React.FC = ({ children }) => {
  const dispatcher = useDispatch();
  const service = new UserService();
  const [loginId, setLoginId] = useState<string|null>();

  const findUser = async (uid: string) => {
    const user = await service.getUserByLoginId(uid);
    if (user && user.uid !== loginId) {
      dispatcher(setUser({
        uid: user.uid,
        name: user.name,
        photoUrl: user.photoUrl,
      }));
      setLoginId(loginId);
    }
    dispatcher(setIsUserLoggedIn(user !== null));
  };

  useEffect(() => {
    const unsubscribe = firebase.auth()
      .onAuthStateChanged((user) => {
        if (user) findUser(user.uid).then();
      });

    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
};
