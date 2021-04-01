import styled from 'styled-components';
import React from 'react';
import { mediaQuery } from 'src/components/constants/mediaQuery';

type Props = {
  onClose: () => void,
  backgroundColor?: string
}

export const Dialog: React.FC<Props> = ({
  children,
  onClose,
  backgroundColor = 'rgba(0,0,0,.5)',
}) => (
  <FullscreenContainer backgroundColor={backgroundColor} onClick={onClose}>
    <Container>
      {children}
    </Container>
  </FullscreenContainer>
);

const FullscreenContainer = styled.div<{backgroundColor: string}>`
  background-color: ${(props) => props.backgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const Container = styled.div`
  box-sizing: border-box;
  background-color: white;
  border-radius: 5px;
  padding: 32px 24px;
  min-width: calc(100% - 16px);
  max-width: calc(100% - 16px);
  
  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    min-width: 400px;
  }
`;
