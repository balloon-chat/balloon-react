import { useMessageState } from 'src/data/redux/message/selector';
import React from 'react';
import { Message } from 'src/components/chat/Message';
import styled from 'styled-components';
import { LoadDialog } from 'src/components/common/LoadDialog';
import { InviteDialog } from 'src/components/chat/InviteDialog';

// tslint:disable-next-line:variable-name
export const MessageList = () => {
  const { messages } = useMessageState();

  return (<Container>
    <ChatContainer>
      {
        messages
            ? messages.map((message, index) => (<Message key={index} {...message}/>))
            : <LoadDialog message={'読み込み中...'}/>
      }
    </ChatContainer>
    <InviteDialog/>
  </Container>);
};

// tslint:disable-next-line:variable-name
const Container = styled.div`
  box-sizing: border-box;
  flex: 1 1 auto;
  position: relative;
  overflow: hidden;
`;

// tslint:disable-next-line:variable-name
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #FDFDFD;
  height: 100%;
  overflow-y: scroll;

  & > div {
    margin-bottom: 16px;
  }
`;
