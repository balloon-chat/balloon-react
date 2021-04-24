import styled from 'styled-components';
import React from 'react';
import Google from 'src/components/svgs/google.svg';
import { useRouter } from 'next/router';

export const GoogleLoginButton = () => {
  const router = useRouter();

  const signIn = async () => {
    await router.push(`${process.env.OAUTH_GOOGLE_LOGIN_URL}?redirectUrl=http://localhost:3000/login`);
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
