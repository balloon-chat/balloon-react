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
import { NavBarUserButton } from 'src/components/navbar/NavBarUserButton';
import { LoginStates } from 'src/data/redux/user/state';
import Image from 'next/image';
import { imagePath } from 'src/components/constants/imagePath';
import Edit from 'src/components/svgs/edit.svg';
import Login from 'src/components/svgs/login.svg';
import { NavLocation, NavLocations } from 'src/view/types/navigation';

export const NavBarHome = () => (
  <NavBar>
    <NavBarHeader />
  </NavBar>
);

type Props = {
  currentLocation?: NavLocation,
};

export const NavBar: React.FC<Props> = ({ currentLocation, children }) => {
  const router = useRouter();
  const { loginState } = useUserSelector();

  return (
    <NavContainer>
      <NavMainContainer>
        <Link href={rootPath.index}>
          <NavTitleContainer>
            <Image src={imagePath.character.blue} height={24} width={40} objectFit="contain" />
            <NavTitle>おもちゃっと</NavTitle>
          </NavTitleContainer>
        </Link>
        <ActionContainer>
          <li>
            <NavButton
              link={topicPath.create}
              isActive={currentLocation === NavLocations.CREATE_TOPIC}
              title="話題を作る"
            >
              <Edit />
            </NavButton>
          </li>
          <li>
            {loginState === LoginStates.LOGGED_IN
              ? <NavBarUserButton />
              : (
                <NavButton
                  link={rootPath.login}
                  linkQuery={{ return_to: router.asPath }}
                  title="ログイン"
                >
                  <Login />
                </NavButton>
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
  justify-content: space-between;
`;

const NavTitleContainer = styled.div`
  align-items: center;
  cursor: pointer;
  color: inherit;
  display: flex;
  font-size: 16px;
  height: 100%;
  text-align: center;
  padding: 16px 0;
  justify-content: center;
  flex-grow: 1;

  @media screen and (min-width: ${mediaQuery.mobile.landscape}px) {
    flex-grow: 0;
    padding: 0;
  }
`;

const NavTitle = styled.div`
  margin-left: 8px;
  white-space: nowrap;
`;

const ActionContainer = styled.ul`
  display: none;
  margin: 0;
  align-items: center;
  padding: 0;
  justify-content: flex-end;
  
  & > li {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
  }
  
  @media screen and (min-width: ${mediaQuery.mobile.landscape}px) {
    display: flex;
  }
`;
