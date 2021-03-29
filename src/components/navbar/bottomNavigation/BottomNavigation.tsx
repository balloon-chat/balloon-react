import styled from 'styled-components';
import { BottomNavigationButton } from 'src/components/navbar/bottomNavigation/BottomNavigationButton';
import { rootPath } from 'src/view/route/pagePath';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import React from 'react';
import Home from 'src/components/svgs/home.svg';
import Edit from 'src/components/svgs/edit.svg';
import Search from 'src/components/svgs/search.svg';

type Props = {
  currentLocation?: 'home' | 'create' | 'join' | 'my-profile';
};

export const BottomNavigation = ({ currentLocation }: Props) => (
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
  </Container>
);

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
    visibility: hidden;
    z-index: -1;
  }
`;
