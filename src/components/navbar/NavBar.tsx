import { NavButton } from 'src/components/navbar/NavBarAction';
import { rootPath, topicPath } from 'src/view/route/pagePath';
import styled from 'styled-components';
import { useUserSelector } from 'src/data/redux/user/selector';
import React from 'react';
import 'firebase/auth';
import Link from 'next/link';
import { NavBarHeader } from 'src/components/navbar/NavBarHeader';
import { useRouter } from 'next/router';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import SpeechBalloon from 'src/components/svgs/speech_balloon.svg';

export const NavBarHome = () => (
  <NavBar>
    <NavBarHeader />
  </NavBar>
);

export const NavBar: React.FC = ({ children }) => {
  const router = useRouter();
  const { isLoggedIn } = useUserSelector();

  return (
    <NavContainer>
      <NavMainContainer>
        <Link href={rootPath.index}>
          <NavTitle>
            <TitleIcon src="/images/character_blue.png" />
            <div>おもちゃっと</div>
          </NavTitle>
        </Link>
        <ActionContainer>
          <li>
            <NavButton link={topicPath.create} title="話題を作る">
              <SpeechBalloon />
            </NavButton>
          </li>
          <li>
            {isLoggedIn ? (
              <NavButton link={rootPath.logout} title="ログアウト" />
            ) : (
              <NavButton
                link={rootPath.login}
                linkQuery={{ return_to: router.asPath }}
                title="ログイン"
              />
            )}
          </li>
        </ActionContainer>
      </NavMainContainer>
      <div>{children}</div>
    </NavContainer>
  );
};

const NavContainer = styled.div`
  background-color: white;
`;

const NavMainContainer = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  margin: 0 auto;
  padding: 0 16px;
  max-width: 1050px;
`;

const NavTitle = styled.div`
  align-items: center;
  cursor: pointer;
  color: inherit;
  display: flex;
  font-size: 16px;
  height: 100%;
  text-align: center;
  padding: 16px 0;
  flex-grow: 1;
  justify-content: center;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    flex-grow: 0;
    padding: 0;
  }
`;

const TitleIcon = styled.img`
  margin-right: 8px;
  height: 24px;
`;

const ActionContainer = styled.ul`
  display: flex;
  flex-grow: 1;
  margin: 0;
  padding: 0;
  position: absolute;
  visibility: hidden;
  justify-content: flex-end;

  & > li {
    display: inline-block;
  }

  // モバイル、タブレット版では消去
  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    position: relative;
    visibility: visible;
  }
`;
