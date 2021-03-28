import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { setIsUserLoggedIn, setPhotoUrl, setUserId } from 'src/data/redux/user/slice';

export const AuthProvider: React.FC = ({ children }) => {
  const dispatcher = useDispatch();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) dispatcher(setUserId(user.uid));
      dispatcher(setPhotoUrl(user?.photoURL ?? null));
      dispatcher(setIsUserLoggedIn(user !== null));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
};
