import styled from 'styled-components';
import { CSSProperties } from 'react';

// tslint:disable-next-line:variable-name
export const NavBar = () => {
  return (<div style={container}>
    <div style={navTitle}>
      <div>ふうせん</div>
      <img style={titleIcon} src={'/images/character_blue.png'} height={48}/>
      <div>チャット</div>
    </div>
    <div style={actionContainer}>
      <NavButton style={navButtonStyle}>
        <img style={actionIcon} src={'/svg/speech_balloon.svg'}/>
        <div>話題を作る</div>
      </NavButton>
      <NavButton style={navButtonStyle}>
        <img style={actionIcon} src={'/svg/exit.svg'}/>
        <div>話題に参加する</div>
      </NavButton>
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

const navTitle: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  fontSize: 36,
  textAlign: 'center',
} as const;

const titleIcon: CSSProperties = {
  margin: '0 16px',
} as const;

const actionContainer: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  marginTop: 16,
  maxWidth: 500,
  width: '100%',
} as const;

// tslint:disable-next-line:variable-name
const NavButton = styled.a`
  &:hover {
    background-color: rgba(0, 0, 0, .1);
    cursor: pointer;
  }
`;

const actionIcon: CSSProperties = {
  height: 32,
  marginRight: 16,
} as const;

const navButtonStyle: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  color: 'inherit',
  flex: 1,
  justifyContent: 'center',
  padding: '16px 0',
  textAlign: 'center',
  textDecoration: 'none',
} as const;
