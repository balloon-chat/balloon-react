import React from 'react';
import { useMessageState } from 'src/data/redux/message/selector';
import { CommentListItem } from 'src/components/topic/commetns/CommentListItem';
import styled from 'styled-components';
import CloseIcon from 'src/components/svgs/close.svg';
import { mediaQuery } from 'src/components/constants/mediaQuery';

type Props = {
  isVisible: boolean,
  onClose: () => void,
}

export const CommentList = ({
  isVisible,
  onClose,
}: Props) => {
  const { messages } = useMessageState();
  return (
    <Wrapper isVisible={isVisible} onClick={onClose}>
      <Container isVisible={isVisible}>
        <CloseButton onClick={() => onClose()}>
          <CloseIcon />
        </CloseButton>
        <Dialog>
          {
            (messages ?? [])
              .map((message, index) => <CommentListItem key={index} message={message} />)
          }
        </Dialog>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ isVisible: boolean }>`
  align-items: center;
  display: flex;
  position: fixed;
  transition: all 0.4s ease-in-out;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  z-index: 200;
  visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')};

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    background-color: ${(props) => (props.isVisible ? 'rgba(0,0,0,.6)' : 'transparent')};
    padding-left: 64px;
    position: absolute;
  }
`;

const Container = styled.div<{ isVisible: boolean }>`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  justify-content: center;
  transition: all 0.4s ease-in-out;
  transform: translateX(${(props) => (props.isVisible ? 0 : -50)}vh);
  visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')};

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    flex-direction: column;
    max-width: 500px;
  }
`;

const Dialog = styled.div`
  background-color: white;
  box-sizing: border-box;
  padding: 16px;
  box-shadow: 20px 20px 60px rgba(0, 0, 0, .1);
  height: 100%;
  width: 100%;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;

  & > div {
    margin-bottom: 16px;
  }

  & > div:last-child {
    margin-bottom: 0;
  }

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    border-radius: 0 0 10px 10px;
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
    border-radius: 10px 10px 0 0;
    width: 100%;
  }
`;
