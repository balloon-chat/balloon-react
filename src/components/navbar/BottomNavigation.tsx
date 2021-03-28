import styled from 'styled-components';
import {
  BottomNavigationButton,
  MyPageNavigationButton,
} from 'src/components/navbar/BottomNavigationButton';
import { rootPath } from 'src/view/route/pagePath';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import { svgImagePath } from 'src/components/constants/imagePath';
import { useUserSelector } from 'src/data/redux/user/selector';
import React from 'react';

type Props = {
  currentLocation?: 'home' | 'create' | 'join' | 'my-page';
};

// tslint:disable-next-line:variable-name
export const BottomNavigation = ({ currentLocation }: Props) => {
  const { isLoggedIn } = useUserSelector();
  return (
    <Container>
      <BottomNavigationButton
        label="ホーム"
        imgSrc={svgImagePath.home}
        linkTo={rootPath.index}
        current={currentLocation === 'home'}
      />
      <BottomNavigationButton
        label="話題を作る"
        imgSrc={svgImagePath.edit}
        linkTo={rootPath.topicPath.create}
        current={currentLocation === 'create'}
      />
      <BottomNavigationButton
        label="話題を探す"
        imgSrc={svgImagePath.search}
        linkTo={rootPath.topicPath.index}
        current={currentLocation === 'join'}
      />
      {isLoggedIn ? (
        <MyPageNavigationButton
          label="マイページ"
          linkTo={rootPath.index}
          current={currentLocation === 'my-page'}
        />
      ) : (
        <BottomNavigationButton
          label="ログイン"
          imgSrc={svgImagePath.login}
          linkTo={rootPath.login}
          current={false}
        />
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
