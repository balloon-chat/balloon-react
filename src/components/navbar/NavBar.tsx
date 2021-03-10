import { CSSProperties } from 'react';
import { NavButton, NavButtonSmall } from 'src/components/navbar/NavBarAction';
import { rootPath, topicPath } from 'src/pages/pagePath';
import styled from 'styled-components';

// tslint:disable-next-line:variable-name
export const NavBar = () => {
  return (<div style={container}>
    <NavTitle>
      <div>ふうせん</div>
      <img style={titleIcon} src={'/images/character_blue.png'}/>
      <div>チャット</div>
    </NavTitle>
    <div style={actionContainer}>
      <NavButton link={topicPath.create} title={'話題を作る'} imgSrc={'/svg/speech_balloon.svg'}/>
      <NavButton link={topicPath.index} title={'話題に参加する'} imgSrc={'/svg/exit.svg'}/>
    </div>
  </div>);
};

// tslint:disable-next-line:variable-name
export const NavBarSmall = () => {
  return (<div style={containerSmall}>
    <NavTitleSmall href={rootPath.index}>
      <div>ふうせん</div>
      <img style={titleIconSmall} src={'/images/character_blue.png'}/>
      <div>チャット</div>
    </NavTitleSmall>
    <div style={actionContainerSmall}>
      <NavButtonSmall link={topicPath.create} title={'話題を作る'} imgSrc={'/svg/speech_balloon.svg'}/>
      <NavButtonSmall link={topicPath.index} title={'話題に参加する'} imgSrc={'/svg/exit.svg'}/>
    </div>
  </div>);
};

const container: CSSProperties = {
  alignItems: 'center',
  backgroundColor: 'white',
  borderBottom: '1px solid rgba(0, 0, 0, .1)',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: 16,
} as const;

const containerSmall: CSSProperties = {
  ...container,
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  paddingTop: 0,
} as const;

// tslint:disable-next-line:variable-name
const NavTitle = styled.a`
  align-items: center;
  color: inherit;
  display: flex;
  font-size: 36px;
  height: 100%;
  text-align: center;
  text-decoration: none;
`;

// tslint:disable-next-line:variable-name
const NavTitleSmall = styled(NavTitle)`
  font-size: 16px;

  &:hover {
    background-color: rgba(0, 0, 0, .1);
  }
`;

const titleIcon: CSSProperties = {
  margin: '0 16px',
  height: 48,
} as const;

const titleIconSmall: CSSProperties = {
  ...titleIcon,
  margin: '0 8px',
  height: 24,
} as const;

const actionContainer: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  marginTop: 16,
  maxWidth: 500,
  width: '100%',
} as const;

const actionContainerSmall: CSSProperties = {
  ...actionContainer,
  marginTop: 0,
};
