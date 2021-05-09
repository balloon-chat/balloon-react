import { GoogleLoginButton } from 'src/components/login/LoginButton';
import styled from 'styled-components';
import React from 'react';
import Image from 'next/image';
import { imagePath } from 'src/components/constants/imagePath';

export const LoginDialog = () => (
  <DialogContainer>
    <TitleContainer>
      <Image alt="" src={imagePath.character.blue} height={100} width={100} objectFit="contain" />
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
