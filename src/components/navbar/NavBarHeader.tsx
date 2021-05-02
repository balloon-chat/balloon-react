import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { rootPath } from 'src/view/route/pagePath';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import SpeechBalloon from 'src/components/svgs/speech_balloon.svg';
import EditIcon from 'src/components/svgs/edit_fill.svg';

export const NavBarHeader = () => (
  <Container>
    <TitleRow>
      <RollingTitleWrapper>
        <RollingTitleSpacer aria-hidden="true">
          コミュニケーション
        </RollingTitleSpacer>
        <RollingTitleContainer aria-hidden="true">
          <RollingTitle>コミュニケーション</RollingTitle>
          <RollingTitle>アイデア出し</RollingTitle>
          <RollingTitle>会議</RollingTitle>
        </RollingTitleContainer>
      </RollingTitleWrapper>
      <Title>をもっと面白く。</Title>
    </TitleRow>
    <ActionsRow>
      <Link href={rootPath.topicPath.create}>
        <CreateTopicButton>
          <EditIcon width={32} height={32} fill="white" />
          <span>話題を作る</span>
        </CreateTopicButton>
      </Link>
      <Link href={rootPath.topicPath.index}>
        <JoinTopicButton>
          <SpeechBalloon width={32} height={32} fill="white" />
          <span>話題に参加する</span>
        </JoinTopicButton>
      </Link>
    </ActionsRow>
  </Container>
);

const Container = styled.div`
  align-items: center;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 32px 32px;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    padding: 80px 32px;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 32px;
  justify-content: center;
  flex-wrap: wrap;
`;

export const Title = styled.h1`
  font-weight: normal;
  margin-left: 4px;
`;

const RollingTitleSpacer = styled.h1`
  visibility: hidden;
`;

const RollingTitle = styled(RollingTitleSpacer)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  opacity: 0; // アニメーション描画前に表示しない。
  visibility: visible;

  animation-name: rollDown;
  animation-duration: 9s;
  animation-delay: 0s;
  animation-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1.28);
  animation-iteration-count: infinite;
  animation-play-state: running;

  @keyframes rollDown {
    0% {
      opacity: 0;
    }

    5% {
      opacity: 0;
      transform: translateY(-60px);
    }

    10% {
      opacity: 1;
      transform: translateY(0);
    }

    30% {
      opacity: 1;
      transform: translateY(0);
    }

    40% {
      opacity: 0;
      transform: translateY(15px);
    }

    100% {
      opacity: 0;
    }
  }
`;

export const RollingTitleWrapper = styled.div`
  position: relative;
  white-space: nowrap;
`;

export const RollingTitleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  display: inline-block;
  font-weight: 500;
  text-align: center;
  width: 100%;

  & ${RollingTitle}:nth-child(2) {
    animation-delay: 3s;
  }

  & ${RollingTitle}:nth-child(3) {
    animation-delay: 6s;
  }
`;

export const ActionButton = styled.button`
  align-items: center;
  box-sizing: border-box;
  border: none;
  border-radius: 50px;
  display: flex;
  color: white;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  flex: 1;
  justify-content: center;
  outline: none;
  padding: 4px;
  white-space: nowrap;

  & > span {
    margin-left: 16px;
  }

  & > img {
    margin-bottom: 16px;
  }

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    font-size: 24px;
    padding: 8px 32px;
  }
`;

const CreateTopicButton = styled(ActionButton)`
  background-color: #78c4d4;
`;

const JoinTopicButton = styled(ActionButton)`
  background-color: #fa9905;  
`;

const ActionsRow = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  max-width: 700px;
  
  & ${ActionButton} {
    margin-top: 16px;
  }

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    flex-direction: row;
    
    & ${CreateTopicButton} {
      margin-right: 8px;
    }
    
    & ${JoinTopicButton} {
      margin-left: 8px;
    }
  }
`;
