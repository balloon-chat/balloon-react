import { GoogleLoginButton } from 'src/components/login/LoginButton';
import styled from 'styled-components';
import React from 'react';

export const LoginDialog = () => (
  <DialogContainer>
    <TitleContainer>
      <img alt="" src="/images/character_blue.png" height={60} />
      <h3>おもちゃっとへようこそ！</h3>
    </TitleContainer>
    <GoogleLoginButton />
  </DialogContainer>
);

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
