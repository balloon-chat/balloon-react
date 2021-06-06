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

export const CommentList = ({ isVisible, onClose }: Props) => {
  const { messages } = useMessageState();
  return (
    <Wrapper isVisible={isVisible}>
      <Container isVisible={isVisible}>
        <CloseButton onClick={() => onClose()}>
          <CloseIcon />
        </CloseButton>
        <Dialog>
          {
            (messages ?? [])
              .map((message) => <CommentListItem message={message} />)
          }
        </Dialog>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div<{isVisible: boolean}>`
  align-items: center;
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 8px;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    left: 16px;
  }
`;

const Container = styled.div<{isVisible: boolean}>`
  display: flex;
  flex-direction: column;
  transform: translateX(${(props) => (props.isVisible ? 0 : -50)}vh);
  transition: all 0.4s ease-in-out;
  visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')};
  z-index: 200;
`;

const Dialog = styled.div`
  background-color: white;
  padding: 16px;
  box-shadow: 20px 20px 60px rgba(0,0,0,.1);
  border-radius: 10px;
  height: 500px;
  width: 350px;
  max-width: calc(100vw - 64px);
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;

  & > div {
    margin-bottom: 16px;
  }

  & > div:last-child {
    margin-bottom: 0;
  }
`;

const CloseButton = styled.div`
  align-items: center;
  border-radius: 50px;
  border: 2px solid rgba(0,0,0,.4);
  background-color: white;
  display: flex;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
  cursor: pointer;
`;
