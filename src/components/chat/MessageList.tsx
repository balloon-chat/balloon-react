import { useMessageState } from 'src/data/redux/message/selector';
import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { observeStart } from 'src/data/redux/message/slice';
import { useTopicState } from 'src/data/redux/topic/selector';
import { Message } from 'src/components/chat/Message';
import styled from 'styled-components';
import { LoadDialog } from 'src/components/common/LoadDialog';
import { InviteDialog } from 'src/components/chat/InviteDialog';

// tslint:disable-next-line:variable-name
export const MessageList = () => {
  const { messages } = useMessageState();
  const { topicId } = useTopicState();
  const dispatcher = useDispatch();

  useEffect(() => {
    if (topicId) dispatcher(observeStart({ topicId }));
  },        [topicId]);

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
