import { CSSProperties } from 'react';
import { NavButton, NavButtonSmall } from 'src/components/navbar/NavBarAction';
import { topicPath } from 'src/pages/pagePath';

// tslint:disable-next-line:variable-name
export const NavBar = () => {
  return (<div style={container}>
    <div style={navTitle}>
      <div>ふうせん</div>
      <img style={titleIcon} src={'/images/character_blue.png'}/>
      <div>チャット</div>
    </div>
    <div style={actionContainer}>
      <NavButton link={topicPath.create} title={'話題を作る'} imgSrc={'/svg/speech_balloon.svg'}/>
      <NavButton link={topicPath.index} title={'話題に参加する'} imgSrc={'/svg/exit.svg'}/>
    </div>
  </div>);
};

// tslint:disable-next-line:variable-name
export const NavBarSmall = () => {
  return (<div style={containerSmall}>
      <div style={navTitleSmall}>
        <div>ふうせん</div>
        <img style={titleIconSmall} src={'/images/character_blue.png'}/>
        <div>チャット</div>
      </div>
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

const navTitle: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  fontSize: 36,
  textAlign: 'center',
} as const;

const navTitleSmall: CSSProperties = {
  ...navTitle,
  fontSize: 16,
};

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
