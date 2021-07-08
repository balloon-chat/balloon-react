import styled from 'styled-components';
import React from 'react';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import { ZIndex } from 'src/components/constants/z_index';
import { FullscreenContainer } from 'src/components/common/FullscreenContainer';

type Props = {
  onClose: () => void,
  backgroundColor?: string
}

export const Dialog: React.FC<Props> = ({
  children,
  onClose,
}) => (
  <Wrapper>
    <FullscreenContainer
      isVisible
      transparent={false}
      onClick={onClose}
    />
    <Container>
      {children}
    </Container>
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;

  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  
  z-index: ${ZIndex.dialog};
`;

const Container = styled.div`
  box-sizing: border-box;
  background-color: white;
  border-radius: 5px;
  padding: 32px 24px;
  min-width: calc(100% - 16px);
  max-width: calc(100% - 16px);
  z-index: ${ZIndex.dialog};

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    min-width: 400px;
  }
`;
