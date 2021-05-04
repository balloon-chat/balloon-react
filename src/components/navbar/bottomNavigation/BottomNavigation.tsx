import styled from 'styled-components';
import { BottomNavigationButton } from 'src/components/navbar/bottomNavigation/BottomNavigationButton';
import { rootPath } from 'src/view/route/pagePath';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import React from 'react';
import Home from 'src/components/svgs/home.svg';
import Edit from 'src/components/svgs/edit.svg';
import Search from 'src/components/svgs/search.svg';
import Login from 'src/components/svgs/login.svg';
import { useUserSelector } from 'src/data/redux/user/selector';
import { LoginStates } from 'src/data/redux/user/state';

export const NavLocations = {
  HOME: 'HOME',
  CREATE_TOPIC: 'CREATE_TOPIC',
  FIND_TOPIC: 'FIND_TOPIC',
  PROFILE: 'PROFILE',
  LOGIN: 'LOGIN',
};

type NavLocation = typeof NavLocations[keyof typeof NavLocations];

type Props = {
  currentLocation?: NavLocation;
};

export const BottomNavigation = ({ currentLocation }: Props) => {
  const { uid, photoUrl, loginState } = useUserSelector();
  return (
    <Container>
      <BottomNavigationButton
        isActive={currentLocation === NavLocations.HOME}
        label="ホーム"
        linkTo={rootPath.index}
      >
        <Home />
      </BottomNavigationButton>
      <BottomNavigationButton
        label="話題を作る"
        linkTo={rootPath.topicPath.create}
        isActive={currentLocation === NavLocations.CREATE_TOPIC}
      >
        <Edit />
      </BottomNavigationButton>
      <BottomNavigationButton
        label="話題を探す"
        linkTo={rootPath.topicPath.index}
        isActive={currentLocation === NavLocations.FIND_TOPIC}
      >
        <Search />
      </BottomNavigationButton>
      {
        loginState !== LoginStates.LOGGED_IN
        && (
        <BottomNavigationButton
          label="ログイン"
          linkTo={rootPath.login}
          isActive={currentLocation === NavLocations.LOGIN}
        >
          <Login />
        </BottomNavigationButton>
        )
      }
      {
        loginState === LoginStates.LOGGED_IN && uid && photoUrl
        && (
          <BottomNavigationButton
            label="プロフィール"
            linkTo={rootPath.usersPath.user(uid)}
            isActive={currentLocation === NavLocations.LOGIN}
          >
            <UserIcon
              isActive={currentLocation === NavLocations.PROFILE}
              loading="lazy"
              src={photoUrl}
              height={32}
              width={32}
            />
          </BottomNavigationButton>
        )
      }
    </Container>
  );
};

const Container = styled.nav`
  background-color: white;
  display: flex;
  width: 100%;
  position: fixed;
  bottom: 0;
  height: 3.5rem;
  max-height: 16vh;

  @media screen and (min-width: ${mediaQuery.mobile.landscape}px) {
    pointer-events: none;
    visibility: hidden;
    z-index: -1;
  }
`;

const UserIcon = styled.img<{isActive: boolean}>`
  box-sizing: border-box;
  border: ${(props) => (props.isActive ? '2px solid #5b87fa' : 'none')};
  border-radius: 50%;
  height: 100%;
  max-height: 100%;
`;
