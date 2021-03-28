import styled from 'styled-components';
import {
  BottomNavigationButton,
  MyPageNavigationButton,
} from 'src/components/navbar/BottomNavigationButton';
import { rootPath } from 'src/view/route/pagePath';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import { useUserSelector } from 'src/data/redux/user/selector';
import React from 'react';
import Home from 'src/components/svgs/home.svg';
import Edit from 'src/components/svgs/edit.svg';
import Search from 'src/components/svgs/search.svg';
import Login from 'src/components/svgs/login.svg';

type Props = {
  currentLocation?: 'home' | 'create' | 'join' | 'my-page';
};

// tslint:disable-next-line:variable-name
export const BottomNavigation = ({ currentLocation }: Props) => {
  const { isLoggedIn } = useUserSelector();
  return (
    <Container>
      <BottomNavigationButton
        isActive={currentLocation === 'home'}
        label="ホーム"
        linkTo={rootPath.index}
      >
        <Home />
      </BottomNavigationButton>
      <BottomNavigationButton
        label="話題を作る"
        linkTo={rootPath.topicPath.create}
        isActive={currentLocation === 'create'}
      >
        <Edit />
      </BottomNavigationButton>
      <BottomNavigationButton
        label="話題を探す"
        linkTo={rootPath.topicPath.index}
        isActive={currentLocation === 'join'}
      >
        <Search />
      </BottomNavigationButton>
      {isLoggedIn ? (
        <MyPageNavigationButton
          label="マイページ"
          linkTo={rootPath.index}
          current={currentLocation === 'my-page'}
        />
      ) : (
        <BottomNavigationButton
          label="ログイン"
          linkTo={rootPath.login}
          isActive={false}
        >
          <Login />
        </BottomNavigationButton>
      )}
    </Container>
  );
};

// tslint:disable-next-line:variable-name
const Container = styled.nav`
  background-color: white;
  display: flex;
  width: 100%;
  position: fixed;
  bottom: 0;
  height: 3.5rem;
  max-height: 16vh;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    pointer-events: none;
    z-index: -1;
  }
`;
