import { useMessageState } from 'src/data/redux/message/selector';
import React from 'react';
import styled from 'styled-components';
import { LoadDialog } from 'src/components/common/LoadDialog';
import { Sketch } from 'src/components/p5/Sketch';

export const CharacterCanvas = () => {
  const { messages } = useMessageState();

  return (
    <Container>
      <ChatContainer>
        {messages ? <Sketch /> : <LoadDialog message="読み込み中..." />}
      </ChatContainer>
    </Container>
  );
};

const Container = styled.div`
  box-sizing: border-box;
  flex: 1 1 auto;
  position: relative;
  overflow: hidden;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fdfdfd;
  height: 100%;
  overflow-y: hidden;
`;
