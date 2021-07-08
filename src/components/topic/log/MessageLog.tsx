import React from 'react';
import { useMessageState } from 'src/data/redux/message/selector';
import { MessageLogItem } from 'src/components/topic/log/MessageLogItem';
import { SwipeInDialog } from 'src/components/topic/dialog/SwipeInDialog';
import styled from 'styled-components';

type Props = {
  isVisible: boolean,
  onClose: () => void,
}

export const MessageLog = ({ isVisible, onClose }: Props) => {
  const { messages } = useMessageState();
  return (
    <SwipeInDialog isVisible={isVisible} onClose={onClose}>
      <Container>
        {
          (messages ?? [])
            .map((message, index) => <MessageLogItem key={index} message={message} />)
        }
      </Container>
    </SwipeInDialog>
  );
};

const Container = styled.div`
  padding: 16px;

  & > div {
    margin-bottom: 16px;
  }

  & > div:last-child {
    margin-bottom: 0;
  }
`;
