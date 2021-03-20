import React, { useEffect } from 'react';
import { LoginDialog } from 'src/components/login/LoginDialog';
import styled from 'styled-components';
import firebase from 'firebase';
import { createUser } from 'src/data/redux/user/action';
import { isInnerPath, rootPath } from 'src/view/route/pagePath';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useUserSelector } from 'src/data/redux/user/selector';

// tslint:disable-next-line:variable-name
const LoginPage = () => {
  const dispatcher = useDispatch();
  const router = useRouter();
  const { return_to } = router.query;
  const { isLoggedIn } = useUserSelector();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) dispatcher(createUser({ uid: user.uid, name: user.displayName, photoUrl: user.photoURL }));
    });

    return () => {
      unsubscribe();
    };
  },        []);

  useEffect(() => {
    console.log(return_to);
  },        [return_to]);

  useEffect(() => {
    if (!isLoggedIn) return;

    if (return_to && typeof return_to === 'string' && isInnerPath(return_to)) {
      router.push(return_to).then();
    } else {
      router.push(rootPath.index).then();
    }
  },        [return_to, isLoggedIn]);

  return (<Container>
    <LoginDialog/>
  </Container>);
};

// tslint:disable-next-line:variable-name
const Container = styled.div`
  align-items: center;
  background-color: #AEE1E1;
  display: flex;
  height: 100%;
  justify-content: center;
`;

export default LoginPage;
