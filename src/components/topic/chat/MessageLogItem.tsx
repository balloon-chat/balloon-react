import React from 'react';
import { MessageEntity } from 'src/view/types/message';
import styled from 'styled-components';

type Props = {
  message: MessageEntity,
}

export const MessageLogItem = ({ message }: Props) => (
  <Container>
    <Thumbnail src={message.senderPhotoUrl} />
    <MainSection>
      <UserName>{message.senderName}</UserName>
      <Message>{message.body}</Message>
    </MainSection>
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const Thumbnail = styled.img`
  height: 48px;
  width: 48px;
  border-radius: 50%;
`;

const MainSection = styled.div`
  flex: 1;
  margin-left: 24px;
`;

const UserName = styled.div`
  font-weight: 700;
  font-size: 15px;
`;

const Message = styled.div`
  word-wrap: anywhere;
`;
