import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { rootPath } from 'src/view/route/pagePath';
import { mediaQuery } from 'src/components/constants/mediaQuery';

// tslint:disable-next-line:variable-name
export const NavBarHeader = () => {

  return (<Container>
    <TitleRow>
      <RollingTitleWrapper>
        <RollingTitleSpacer aria-hidden={'true'}>コミュニケーション</RollingTitleSpacer>
        <RollingTitleContainer aria-hidden={'true'}>
          <RollingTitle>コミュニケーション</RollingTitle>
          <RollingTitle>アイデア出し</RollingTitle>
          <RollingTitle>会議</RollingTitle>
        </RollingTitleContainer>
      </RollingTitleWrapper>
      <Title>をもっと面白く。</Title>
    </TitleRow>
    <Link href={rootPath.topicPath.create}>
      <CreateTopicButton>
        <Image src={'/svg/speech_balloon_white.svg'} width={32} height={32}/>
        <span>話題を作る</span>
      </CreateTopicButton>
    </Link>
  </Container>);
};

// tslint:disable-next-line:variable-name
export const Container = styled.div`
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

// tslint:disable-next-line:variable-name
export const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 32px;
  justify-content: center;
  flex-wrap: wrap;
`;

// tslint:disable-next-line:variable-name
export const Title = styled.h1`
  font-weight: normal;
`;

// tslint:disable-next-line:variable-name
const RollingTitleSpacer = styled.h1`
  visibility: hidden;
`;

// tslint:disable-next-line:variable-name
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

// tslint:disable-next-line:variable-name
export const RollingTitleWrapper = styled.div`
  position: relative;
  white-space: nowrap;

  & ${RollingTitleSpacer}:before {
    content: '「 ';
  }

  & ${RollingTitleSpacer}:after {
    content: ' 」';
  }
`;

// tslint:disable-next-line:variable-name
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

// tslint:disable-next-line:variable-name
export const CreateTopicButton = styled.button`
  align-items: center;
  box-sizing: border-box;
  background-color: #78C4D4;
  border: none;
  border-radius: 50px;
  display: flex;
  color: white;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  max-width: 500px;
  justify-content: center;
  outline: none;
  padding: 4px;
  width: 100%;

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
