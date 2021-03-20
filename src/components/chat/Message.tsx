import { MessageEntity } from 'src/view/types/message';
import styled from 'styled-components';
import React from 'react';
import { dateFormat } from 'src/view/util/format';

// tslint:disable-next-line:variable-name
export const Message: React.FC<MessageEntity> = ({ body, createdAt, senderName, senderPhotoUrl }) => {
  return (<Container>
    <UserIcon src={senderPhotoUrl}/>
    <MainContainer>
      <MessageHeader>
        <UserName>{senderName}</UserName>
        <TimeStamp>{dateFormat(new Date(createdAt))}</TimeStamp>
      </MessageHeader>
      <MessageBody>{body}</MessageBody>
    </MainContainer>
  </Container>);
};

// tslint:disable-next-line:variable-name
const Container = styled.div`
  display: flex;
`;

// tslint:disable-next-line:variable-name
const MainContainer = styled.div`
  margin-left: 16px;
`;

// tslint:disable-next-line:variable-name
const UserIcon = styled.img`
  border-radius: 50%;
  height: 40px;
  width: 40px;
  object-fit: contain;
`;

// tslint:disable-next-line:variable-name
const MessageHeader = styled.h2`
  align-items: center;
  display: inline-flex;
  font-size: 16px;
  font-weight: 500;
`;

// tslint:disable-next-line:variable-name
const UserName = styled.span`
  margin-right: 0.5rem;
  font-weight: 400;
`;

// tslint:disable-next-line:variable-name
const TimeStamp = styled.span`
  color: rgba(0, 0, 0, .5);
  font-size: 0.75em;
`;
// tslint:disable-next-line:variable-name
const MessageBody = styled.div`
`;
