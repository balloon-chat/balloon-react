import { NavButton } from 'src/components/navbar/NavBarAction';
import { rootPath, topicPath } from 'src/pages/pagePath';
import styled from 'styled-components';
import { useUserSelector } from 'src/data/redux/user/selector';
import React from 'react';
import 'firebase/auth';
import Link from 'next/link';
import { NavBarHeader } from 'src/components/navbar/NavBarHeader';

// tslint:disable-next-line:variable-name
export const NavBarHome = () => {
  return (<NavBar>
    <NavBarHeader/>
  </NavBar>);
};

// tslint:disable-next-line:variable-name
export const NavBar: React.FC = ({ children }) => {
  const { uid } = useUserSelector();
  const isLoggedIn = uid !== null;

  return (<NavContainer>
    <NavTitle href={rootPath.index}>
      <div>ふうせん</div>
      <TitleIcon src={'/images/character_blue.png'}/>
      <div>チャット</div>
    </NavTitle>
    <ActionContainer>
      <NavButton link={topicPath.create} title={'話題を作る'} imgSrc={'/svg/speech_balloon.svg'}/>
      <NavButton link={topicPath.index} title={'話題に参加する'} imgSrc={'/svg/exit.svg'}/>
    </ActionContainer>
  </NavContainer>);
};

// tslint:disable-next-line:variable-name
const NavContainer = styled.div`
  align-items: center;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
`;

// tslint:disable-next-line:variable-name
const NavTitle = styled.div`
  align-items: center;
  color: inherit;
  display: flex;
  font-size: 16px;
  height: 100%;
  text-align: center;
  margin-right: 16px;

  &:hover {
    background-color: rgba(0, 0, 0, .1);
  }
`;

// tslint:disable-next-line:variable-name
const TitleIcon = styled.img`
  margin-right: 8px;
  height: 24px;
`;

// tslint:disable-next-line:variable-name
const ActionContainer = styled.ul`
  display: flex;
  flex-grow: 1;
  margin: 0;
  padding: 0;
  justify-content: flex-end;

  & > li {
    display: inline-block;
  }
`;
