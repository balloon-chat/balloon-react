import styled from 'styled-components';
import Link from 'next/link';
import { ParsedUrlQueryInput } from 'querystring';
import React from 'react';
import { mediaQuery } from 'src/components/constants/mediaQuery';

type Props = {
  link: string,
  linkQuery?: string | ParsedUrlQueryInput,
  isActive?: boolean,
  label: string
};

export const NavButton: React.FC<Props> = ({
  label,
  link,
  linkQuery,
  isActive,
  children,
}) => (
  <Link href={{ pathname: link, query: linkQuery }} passHref>
    <NavButtonContainer isActive={isActive ?? false}>
      {children}
      <ActionTitle>{label}</ActionTitle>
    </NavButtonContainer>
  </Link>
);

const NavButtonContainer = styled.a<{ isActive: boolean }>`
  align-items: center;
  color: rgba(0,0,0,.8);
  background-color: ${(props) => (props.isActive ? 'rgba(0,0,0,.05)' : 'white')};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  padding: 8px;

  & > svg {
    fill: currentColor;
    color: rgba(0,0,0,.6);
  }

  @media screen and (min-width: ${mediaQuery.mobile.landscape}px) {
    background-color: white;
    flex-direction: row;
    font-size: 16px;
    height: 100%;
    padding: 12px 16px;
    letter-spacing: 0.25px;
    text-align: center;
    text-decoration: none;
    position: relative;

    &:after {
      height: .25rem;
      border-top-left-radius: .25rem;
      border-top-right-radius: .25rem;
      background-color: ${(props) => (props.isActive ? '#78c4d4' : 'none')};
      position: absolute;
      content: '';
      right: 0;
      bottom: 0;
      left: 0;
    }

    & > svg {
      margin-right: 8px;
      width: 24px;
      height: 24px;
    }
  }
`;

const ActionTitle = styled.div`
  font-size: 12px;
  box-sizing: border-box;
  white-space: nowrap;

  @media screen and (min-width: ${mediaQuery.mobile.landscape}px) {
    font-size: inherit;
  }
`;
