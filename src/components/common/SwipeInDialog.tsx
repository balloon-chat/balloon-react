import CloseIcon from 'src/components/svgs/close.svg';
import styled from 'styled-components';
import { ZIndex } from 'src/components/constants/z_index';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import React from 'react';
import { FullscreenContainer } from 'src/components/common/FullscreenContainer';
import { Transition } from 'react-transition-group';

type Props = {
  isVisible: boolean,
  onClose: () => void,
}

const duration = 400;

export const SwipeInDialog: React.FC<Props> = ({ isVisible, onClose, children }) => (
  <Transition in={isVisible} timeout={duration} mountOnEnter unmountOnExit>
    {(status) => {
      const visibleState = status === 'entering' || status === 'entered';
      return (
        <>
          <Wrapper>
            <FullscreenContainer
              animate
              transparent={false}
              isVisible={visibleState}
              onClick={onClose}
            />
            <Dialog isVisible={visibleState} duration={duration}>
              <DialogBody>{children}</DialogBody>
              <CloseButton onClick={() => onClose()}>
                <CloseIcon />
              </CloseButton>
            </Dialog>
          </Wrapper>
        </>
      );
    }}
  </Transition>
);

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  user-select: none;
  z-index: ${ZIndex.dialog};
  
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
`;

const Dialog = styled.div<{ isVisible: boolean, duration: number }>`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  
  animation: fadein ${({ duration }) => duration}ms;
  transition: all ${({ duration }) => duration}ms;
  opacity: ${({ isVisible }) => (isVisible ? 1.0 : 0)};
  transform: translateX(${({ isVisible }) => (isVisible ? 0 : -100)}px);
  z-index: ${ZIndex.dialog};


  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    flex-direction: column;
    max-width: 500px;
  }
`;

const DialogBody = styled.div`
  background-color: white;
  box-sizing: border-box;
  box-shadow: 20px 20px 60px rgba(0, 0, 0, .1);
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    border-radius: 10px 10px 0 0;
    padding: 16px 0;
    height: 100%;
    max-width: calc(100vw - 64px);
  }
  
  @media screen and (min-height: 700px) {
    height: 600px;
  }
`;

const CloseButton = styled.div`
  align-items: center;
  box-sizing: border-box;
  background-color: #caeaeb;
  display: flex;
  justify-content: center;
  padding: 8px 2px;
  cursor: pointer;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    border-radius: 0 0 10px 10px;
    width: 100%;
  }
`;
