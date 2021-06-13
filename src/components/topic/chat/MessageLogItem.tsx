import React from 'react';
import { MessageEntity } from 'src/view/types/message';
import { dateTimeFormat } from 'src/view/util/format';
import styled from 'styled-components';

type Props = {
  message: MessageEntity,
}

export const MessageLogItem = ({ message }: Props) => (
  <Container>
    <Thumbnail src={message.senderPhotoUrl} />
    <MainSection>
      <HeaderSection>
        <UserName>{message.senderName}</UserName>
        <UploadDate>{dateTimeFormat(message.createdAt, '.')}</UploadDate>
      </HeaderSection>
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

const HeaderSection = styled.div`
  display: flex;
  align-items: baseline;
`;

const UploadDate = styled.div`
  color: rgba(0,0,0,.6);
  margin-left: 8px;
  font-size: 14px;
`;

const UserName = styled.div`
  font-weight: 700;
  font-size: 15px;
`;

const Message = styled.div`
  word-wrap: anywhere;
`;
