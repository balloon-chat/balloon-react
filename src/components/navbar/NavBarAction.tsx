// tslint:disable-next-line:variable-name
import styled from 'styled-components';
import { CSSProperties } from 'react';

// tslint:disable-next-line:variable-name
export const NavButton = ({ title, imgSrc }: { title: string, imgSrc: string }) => {
  return (<NavButtonContainer style={navButton}>
    <img style={actionIcon} src={imgSrc}/>
    <div>{title}</div>
  </NavButtonContainer>);
};

// tslint:disable-next-line:variable-name
export const NavButtonSmall = ({ title, imgSrc }: { title: string, imgSrc: string }) => {
  return (<NavButtonContainer style={navButtonSmall}>
    <img style={actionIconSmall} src={imgSrc}/>
    <div>{title}</div>
  </NavButtonContainer>);
};

// tslint:disable-next-line:variable-name
const NavButtonContainer = styled.a`
  &:hover {
    background-color: rgba(0, 0, 0, .1);
    cursor: pointer;
  }
`;

const navButton: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  color: 'inherit',
  flex: 1,
  fontSize: 16,
  justifyContent: 'center',
  padding: '16px 0',
  textAlign: 'center',
  textDecoration: 'none',
} as const;

const navButtonSmall: CSSProperties = {
  ...navButton,
  padding: '8px 0',
} as const;

const actionIcon: CSSProperties = {
  height: 32,
  marginRight: 16,
} as const;

const actionIconSmall: CSSProperties = {
  ...actionIcon,
  height: 24,
} as const;
