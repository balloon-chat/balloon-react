import { MessageEntity } from 'src/view/types/message';
import styled from 'styled-components';
import React from 'react';
import { dateFormat } from 'src/view/util/format';

export const Message: React.FC<MessageEntity> = ({
  body,
  createdAt,
  senderName,
  senderPhotoUrl,
}) => (
  <Container>
    <UserIcon src={senderPhotoUrl} />
    <MainContainer>
      <MessageHeader>
        <UserName>{senderName}</UserName>
        <TimeStamp>{dateFormat(new Date(createdAt))}</TimeStamp>
      </MessageHeader>
      <MessageBody>{body}</MessageBody>
    </MainContainer>
  </Container>
);

const Container = styled.div`
  display: flex;
`;

const MainContainer = styled.div`
  margin-left: 16px;
`;

const UserIcon = styled.img`
  border-radius: 50%;
  height: 40px;
  width: 40px;
  object-fit: contain;
`;

const MessageHeader = styled.h2`
  align-items: center;
  display: inline-flex;
  font-size: 16px;
  font-weight: 500;
`;

const UserName = styled.span`
  margin-right: 0.5rem;
  font-weight: 400;
`;

const TimeStamp = styled.span`
  color: rgba(0, 0, 0, 0.5);
  font-size: 0.75em;
`;

const MessageBody = styled.div``;
