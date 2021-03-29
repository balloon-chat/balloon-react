import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { setIsUserLoggedIn, setUser } from 'src/data/redux/user/slice';

export const AuthProvider: React.FC = ({ children }) => {
  const dispatcher = useDispatch();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      dispatcher(setUser({
        uid: user?.uid ?? null,
        name: user?.displayName ?? null,
        photoUrl: user?.photoURL ?? null,
      }));
      dispatcher(setIsUserLoggedIn(user !== null));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
};
