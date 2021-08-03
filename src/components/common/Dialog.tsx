import styled from 'styled-components';
import React from 'react';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import { ZIndex } from 'src/components/constants/z_index';
import { FullscreenContainer } from 'src/components/common/FullscreenContainer';
import { Transition } from 'react-transition-group';
import { fadeinAnimation } from 'src/components/common/Animations';

type Props = {
  onClose: () => void,
  isVisible: boolean,
  backgroundColor?: string,
  animate?: boolean,
}

const duration = 200;

export const Dialog: React.FC<Props> = ({
  children,
  isVisible,
  onClose,
  animate = false,
}) => (
  <Transition in={isVisible} timeout={animate ? duration : 0} unmountOnExit mountOnEnter>
    {
      (status) => {
        const visibleState = status === 'entering' || status === 'entered';
        return (
          <Wrapper>
            <FullscreenContainer
              animate={animate}
              isVisible={visibleState}
              onClick={onClose}
            />
            <Container duration={animate ? duration : 0} isVisible={visibleState}>
              {children}
            </Container>
          </Wrapper>
        );
      }
    }
  </Transition>
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

const Container = styled.div<{isVisible: boolean, duration: number}>`
  box-sizing: border-box;
  background-color: white;
  border-radius: 5px;
  padding: 32px 24px;
  min-width: calc(100% - 16px);
  max-width: calc(100% - 16px);
  z-index: ${ZIndex.dialog};
  
  animation: ${fadeinAnimation} ${({ duration }) => duration}ms;
  transition: all ${({ duration }) => duration}ms;
  opacity: ${({ isVisible }) => (isVisible ? 1.0 : 0.0)};

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    min-width: 400px;
  }
`;
