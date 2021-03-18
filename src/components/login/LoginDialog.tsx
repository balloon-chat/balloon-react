import { GoogleLoginButton } from 'src/components/login/LoginButton';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useDispatch } from 'react-redux';
import { createUser } from 'src/data/redux/user/action';
import { isOuterPath, rootPath } from 'src/pages/pagePath';

// tslint:disable-next-line:variable-name
export const LoginDialog = () => {
  const dispatcher = useDispatch();
  const router = useRouter();
  const { return_to } = router.query;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setIsLoggedIn(user !== null);
      if (user) dispatcher(createUser({ uid: user.uid, name: user.displayName, photoUrl: user.photoURL }));
    });
  },        []);

  useEffect(() => {
    if (!isLoggedIn) return;

    // TODO: improve this validation
    if (return_to && typeof return_to === 'string' && !isOuterPath(return_to)) {
      router.push(return_to).then();
    } else {
      router.push(rootPath.index).then();
    }
  },        [return_to, isLoggedIn]);

  return (<DialogContainer>
    <TitleContainer>
      <img src={'/images/character_blue.png'} height={60}/>
      <h3>おもちゃっとへようこそ！</h3>
    </TitleContainer>
    <GoogleLoginButton/>
  </DialogContainer>);
};

// tslint:disable-next-line:variable-name
const DialogContainer = styled.div`
  box-sizing: border-box;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px;
  background-color: white;
  border-radius: 5px;
  width: 350px;
`;

// tslint:disable-next-line:variable-name
const TitleContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
  font-size: 20px;

  & > img {
    margin-bottom: 16px;
  }
`;
