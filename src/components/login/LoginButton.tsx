import styled from 'styled-components';
import React from 'react';
import Google from 'src/components/svgs/google.svg';
import { useRouter } from 'next/router';

export const GoogleLoginButton = () => {
  const router = useRouter();
  const { return_to } = router.query;
  const signIn = async () => {
    let query: {return_to: string} | null = null;
    if (typeof return_to === 'string' && return_to) {
      query = { return_to };
    }
    await router.push({
      pathname: `${process.env.OAUTH_GOOGLE_LOGIN_URL}`,
      query,
    });
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
