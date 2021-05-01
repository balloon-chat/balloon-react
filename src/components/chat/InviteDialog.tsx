import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CopyToClipboard from 'react-copy-to-clipboard';
import { InviteCode } from 'src/components/chat/InviteCode';
import DoneIcon from 'src/components/svgs/done.svg';
import { useTopicState } from 'src/data/redux/topic/selector';

export const InviteDialog = () => {
  const router = useRouter();

  const { code } = useTopicState();

  const [isClosed, setIsClosed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(`${process.env.BASE_URL}${router.asPath}`);
  }, []);

  const copyInvitation = async () => {
    setIsCopied(true);
    // 3秒間表示
    const waitSeconds = 3;
    await new Promise((resolve) => { setTimeout(() => resolve(), waitSeconds * 1000); });
    setIsClosed(true);
  };

  if (!code) {
    return <></>;
  }

  return (
    <>
      {!isClosed && (
        <Container>
          {
            !isCopied
              ? (
                <>
                  <Title>みんなを招待しましょう!</Title>
                  {code && (
                    <InvitationCodeContainer>
                      <InviteCode code={code} />
                    </InvitationCodeContainer>
                  )}
                  <ActionContainer>
                    <CloseButton onClick={() => setIsClosed(true)}>閉じる</CloseButton>
                    <CopyToClipboard text={url} onCopy={copyInvitation}>
                      <TopicLinkButton>招待をコピー</TopicLinkButton>
                    </CopyToClipboard>
                  </ActionContainer>
                </>
              )
              : (
                <DoneContainer>
                  <DoneIcon />
                  <Title>コピーしました</Title>
                </DoneContainer>
              )
          }
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  align-items: start;
  border: #ccc solid 1px;
  background-color: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 16px 32px;
  transition: all 0.2s ease-out 0s;
  z-index: 2000;
  position: absolute;
  bottom: 16px;
  right: 16px;
`;

const Title = styled.h2`
  font-size: 16px;
  align-self: center;
`;

const TopicLinkButton = styled.div`
  border-radius: 5px;
  cursor: pointer;
  color: #5b87fa;
  display: flex;
  flex-direction: row;
  padding: 8px 16px;

  & > div:first-child {
    margin-right: 8px;
  }
  
  :hover{
    background-color: rgb(0,0,0,.1);
  }
`;

const CloseButton = styled.div`
  border-radius: 5px;
  cursor: pointer;
  padding: 8px 16px;

  :hover{
    background-color: rgb(0,0,0,.1);
  }
`;

const InvitationCodeContainer = styled.div`
  padding: 0 16px;
  margin: 8px 0;
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;

  & > div:first-child {
    margin-right: 16px;
  }
`;

const DoneContainer = styled.div`
  display: flex;

  & > svg {
    margin-right: 8px;
    fill: #4CAF50;
  }
`;
