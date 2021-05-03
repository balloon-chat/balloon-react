import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CopyToClipboard from 'react-copy-to-clipboard';
import { InviteCode } from 'src/components/topic/invitation/InviteCode';
import DoneIcon from 'src/components/svgs/done.svg';
import { useTopicState } from 'src/data/redux/topic/selector';
import { mediaQuery } from 'src/components/constants/mediaQuery';

export const InviteDialog = () => {
  const router = useRouter();

  const { code } = useTopicState();

  const [isClosed, setIsClosed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [url, setUrl] = useState('');
  const [invitationMessage, setInvitationMessage] = useState('');

  useEffect(() => {
    setUrl(`${process.env.BASE_URL}${router.asPath}`);
  }, []);

  useEffect(() => {
    setInvitationMessage(`
    あなたを『おもちゃっと』に招待します！
    
    招待リンク: ${url}
    招待コード: 0063 - 4954
    `);
  }, [url]);

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
                    <CopyToClipboard text={invitationMessage} onCopy={copyInvitation}>
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
  box-sizing: border-box;
  align-items: start;
  border: #ccc solid 1px;
  background-color: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  transition: all 0.2s ease-out 0s;
  z-index: 2000;
  position: absolute;
  bottom: 16px;
  right: 16px;
  left: 16px;

  @media screen and (min-width: ${mediaQuery.mobile.landscape}px) {
    padding: 16px 32px;
    left: auto;
  }
`;

const Title = styled.h2`
  font-size: 16px;
  align-self: start;
`;

const TopicLinkButton = styled.div`
  border-radius: 5px;
  cursor: pointer;
  color: #5b87fa;
  display: flex;
  flex-direction: row;
  padding: 8px 16px;

  & > button:first-child {
    margin-right: 8px;
  }
  
  :hover{
    background-color: rgb(0,0,0,.1);
  }
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;

  & > div:first-child {
    margin-right: 16px;
  }
`;

const CloseButton = styled.button`
  border-radius: 5px;
  cursor: pointer;
  padding: 8px 16px;

  :hover{
    background-color: rgb(0,0,0,.1);
  }
`;

const InvitationCodeContainer = styled.div`
  margin: 8px 0;
`;

const DoneContainer = styled.div`
  display: flex;

  & > svg {
    margin-right: 8px;
    fill: #4CAF50;
  }
`;
