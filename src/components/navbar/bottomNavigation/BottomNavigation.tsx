import styled from 'styled-components';
import { rootPath } from 'src/view/route/pagePath';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import React from 'react';
import Home from 'src/components/svgs/home.svg';
import Edit from 'src/components/svgs/edit.svg';
import Search from 'src/components/svgs/search.svg';
import Login from 'src/components/svgs/login.svg';
import { useUserSelector } from 'src/data/redux/user/selector';
import { LoginStates } from 'src/data/redux/user/state';
import { NavLocation, NavLocations } from 'src/view/types/navigation';
import { useRouter } from 'next/router';
import { NavButton } from 'src/components/navbar/NavBarAction';

type Props = {
  currentLocation?: NavLocation,
};

export const BottomNavigation = ({ currentLocation }: Props) => {
  const router = useRouter();
  const { uid, photoUrl, loginState } = useUserSelector();

  const return_to = () => {
    if (currentLocation === NavLocations.LOGIN) return null;
    return { return_to: router.asPath };
  };

  return (
    <Container>
      <NavButton
        isActive={currentLocation === NavLocations.HOME}
        label="ホーム"
        link={rootPath.index}
      >
        <Home />
      </NavButton>
      <NavButton
        label="話題を作る"
        link={rootPath.topicPath.create}
        isActive={currentLocation === NavLocations.CREATE_TOPIC}
      >
        <Edit />
      </NavButton>
      <NavButton
        label="話題を探す"
        link={rootPath.topicPath.index}
        isActive={currentLocation === NavLocations.FIND_TOPIC}
      >
        <Search />
      </NavButton>
      {
        loginState !== LoginStates.LOGGED_IN
        && (
        <NavButton
          label="ログイン"
          link={rootPath.login}
          linkQuery={return_to() ?? undefined}
          isActive={currentLocation === NavLocations.LOGIN}
        >
          <Login />
        </NavButton>
        )
      }
      {
        loginState === LoginStates.LOGGED_IN && uid && photoUrl
        && (
          <NavButton
            label="プロフィール"
            link={rootPath.usersPath.user(uid)}
            isActive={currentLocation === NavLocations.LOGIN}
          >
            <UserIcon
              isActive={currentLocation === NavLocations.PROFILE}
              loading="lazy"
              src={photoUrl}
              height={32}
              width={32}
            />
          </NavButton>
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
