import React from 'react';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import styled from 'styled-components';

type Props = {
  message: string,
  onClick: () => void,
  isActive?: boolean,
  cartStyle?: boolean
}

export const ChatAction: React.FC<Props> = ({
  children,
  message,
  onClick,
  isActive = false,
}) => (
  <Container onClick={onClick} isActive={isActive}>
    <IconContainer>{children}</IconContainer>
    <Action>{message}</Action>
  </Container>
);

const Container = styled.div<{ isActive: boolean }>`
  color: ${(props) => (props.isActive ? '#5b87fa' : '#555555')};
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const IconContainer = styled.div`
  width: 48px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;

  & > svg {
    fill: currentColor;
    color: currentColor;
  }
`;

const Action = styled.div`
  visibility: hidden;
  position: absolute;
  user-select: none;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    visibility: visible;
    position: inherit;
  }
`;
