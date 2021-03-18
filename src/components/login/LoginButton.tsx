import styled from 'styled-components';
import Image from 'next/image';
import firebase from 'firebase/app';
import 'firebase/auth';

// tslint:disable-next-line:variable-name
export const GoogleLoginButton = () => {
  const signIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
  };

  return (<LoginButton onClick={() => signIn()}>
    <Image src={'/images/icon-google.svg'} width={24} height={24}/>
    <ButtonText>Googleで続ける</ButtonText>
  </LoginButton>);
};

// tslint:disable-next-line:variable-name
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
  letter-spacing: .25px;
  outline: none;
  padding: 8px 16px;
  text-decoration: none;
  width: 100%;
`;

// tslint:disable-next-line:variable-name
const ButtonText = styled.div`
  flex-grow: 1;
`;