import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { login as loginAction } from 'src/data/redux/user/action';

export const AuthProvider: React.FC = ({ children }) => {
  const dispatcher = useDispatch();

  const login = async (user: firebase.User) => {
    const idToken = await user.getIdToken();
    dispatcher(loginAction({
      loginId: user.uid,
      idToken,
    }));
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) login(user).then();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
};
