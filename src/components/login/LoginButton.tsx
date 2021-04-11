import styled from 'styled-components';
import firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';
import Google from 'src/components/svgs/google.svg';

export const GoogleLoginButton = () => {
  const signIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithRedirect(provider);
  };

  return (
    <LoginButton onClick={() => signIn()}>
      <Google width={24} height={24} />
      <ButtonText>Googleで続ける</ButtonText>
    </LoginButton>
  );
};

const LoginButton = styled.button`
  align-content: center;
  border: 1px solid #dadce0;
  background-color: white;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  font-weight: 500;
  font-size: 14px;
  justify-content: space-between;
  letter-spacing: 0.25px;
  outline: none;
  padding: 8px 16px;
  text-decoration: none;
  width: 100%;
`;

const ButtonText = styled.div`
  flex-grow: 1;
`;
