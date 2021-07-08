import CloseIcon from 'src/components/svgs/close.svg';
import styled from 'styled-components';
import { ZIndex } from 'src/components/constants/z_index';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import React from 'react';
import { FullscreenContainer } from 'src/components/common/FullscreenContainer';

type Props = {
  isVisible: boolean,
  onClose: () => void,
}

export const SwipeInDialog: React.FC<Props> = ({ isVisible, onClose, children }) => (
  <Wrapper>
    <FullscreenContainer
      transparent={false}
      isVisible={isVisible}
      onClick={onClose}
    />
    <Dialog isVisible={isVisible}>
      <DialogBody>{children}</DialogBody>
      <CloseButton onClick={() => onClose()}>
        <CloseIcon />
      </CloseButton>
    </Dialog>
  </Wrapper>
);

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  user-select: none;
  visibility: hidden;
  z-index: ${ZIndex.dialog};
  
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
`;

const Dialog = styled.div<{ isVisible: boolean }>`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  justify-content: center;
  transition: all 0.4s ease-in-out;
  transform: translateX(${(props) => (props.isVisible ? 0 : -100)}px);
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')};

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
    max-height: 600px;
    max-width: calc(100vw - 64px);
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
