import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { imagePath } from 'src/components/constants/imagePath';
import { mediaQuery } from 'src/components/constants/mediaQuery';

type Props = {
  message: string,
}

export const Snackbar = ({ message }: Props) => (
  <Container>
    <Image src={imagePath.character.blue} height={32} width={32} />
    <Message>{message}</Message>
  </Container>
);

const Container = styled.div`
  animation: popup 5s ease;
  align-items: center;
  background-color: #5F8EC1FF;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgb(6 7 23 / 30%);
  color: white;
  display: flex;
  padding: 16px;
  opacity: 0;
  transition: .3s ease;
  margin: 0 16px 80px 0;
  position: fixed;
  right: 0;
  bottom: 0;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    margin: 36px;
  }

  @keyframes popup {
    0% {
      opacity: 0;
      transform: scale(.9) translateY(20px);
    }

    5% {
      transform: scale(1) translateY(0px);
      opacity: 1;
    }

    95% {
      transform: scale(1) translateY(0px);
      opacity: 1;
    }

    100% {
      opacity: 0;
      transform: scale(.9) translateY(20px);
    }
  }
`;

const Message = styled.div`
  margin-left: 16px;
`;
