import styled from 'styled-components';
import Link from 'next/link';
import { ParsedUrlQueryInput } from 'querystring';
import React from 'react';

type Props = {
  title: string,
  link: string,
  linkQuery?: string | ParsedUrlQueryInput,
  isActive?: boolean,
};

export const NavButton: React.FC<Props> = ({
  title,
  link,
  linkQuery,
  isActive,
  children,
}) => (
  <Link href={{
    pathname: link,
    query: linkQuery,
  }}
  >
    <NavButtonContainer isActive={isActive ?? false}>
      {children}
      <ActionTitle>{title}</ActionTitle>
    </NavButtonContainer>
  </Link>
);

const NavButtonContainer = styled.a<{ isActive: boolean }>`
  align-items: center;
  display: flex;
  font-size: 16px;
  justify-content: center;
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
    fill: currentColor;
    color: rgba(0, 0, 0, .6);
    margin-right: 8px;
    width: 24px;
    height: 24px;
  }
`;

const ActionTitle = styled.div`
  box-sizing: border-box;
  white-space: nowrap;
`;
