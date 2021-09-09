import React from 'react';
import { MessageEntity } from 'src/view/types/message';
import { dateTimeFormat } from 'src/view/util/format';
import styled from 'styled-components';
import Link from 'next/link';
import { rootPath } from 'src/view/route/pagePath';

type Props = {
  message: MessageEntity,
}

export const MessageLogItem = ({ message }: Props) => (
  <Container>
    <SenderLink message={message}>
      <Thumbnail src={message.senderPhotoUrl} />
    </SenderLink>
    <MainSection>
      <HeaderSection>
        <SenderLink message={message}>
          <UserName anonymous={message.anonymousSender}>{message.senderName}</UserName>
          ;
        </SenderLink>
        <UploadDate>{dateTimeFormat(message.createdAt, '.')}</UploadDate>
      </HeaderSection>
      <Message>{message.body}</Message>
    </MainSection>
  </Container>
);

const SenderLink: React.FC<{message: MessageEntity}> = ({ message, children }) => {
  if (message.anonymousSender) return <>{children}</>;

  return (
    <Link href={rootPath.usersPath.user(message.senderId)}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a>{children}</a>
    </Link>
  );
};

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

const UserName = styled.div<{anonymous: boolean}>`
  font-weight: 700;
  font-size: 15px;
  
  :hover {
    text-decoration-line: ${({ anonymous }) => (anonymous ? 'none' : 'underline')};
  }
`;

const Message = styled.div`
  word-wrap: anywhere;
`;
