import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { setUserId } from 'src/data/redux/user/slice';

// tslint:disable-next-line:variable-name
export const AuthProvider: React.FC = ({ children }) => {
  const dispatcher = useDispatch();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) dispatcher(setUserId(user.uid));
    });

    return () => {
      unsubscribe();
    };
  },        []);

  return (<>{children}</>);
};
