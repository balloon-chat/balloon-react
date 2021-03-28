import styled from 'styled-components';
import Link from 'next/link';
import { ParsedUrlQueryInput } from 'querystring';
import React from 'react';

type Props = {
  title: string;
  link: string;
  linkQuery?: string | ParsedUrlQueryInput;
};

export const NavButton: React.FC<Props> = ({
  title,
  link,
  linkQuery,
  children,
}) => (
  <Link href={{ pathname: link, query: linkQuery }}>
    <NavButtonContainer>
      {children}
      <ActionTitle hasIcon={children !== undefined}>{title}</ActionTitle>
    </NavButtonContainer>
  </Link>
);

const NavButtonContainer = styled.div`
  align-items: center;
  display: flex;
  color: inherit;
  font-size: 16px;
  justify-content: center;
  padding: 8px 16px;
  letter-spacing: 0.25px;
  text-align: center;
  text-decoration: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  & > svg {
    fill: currentColor;
  }
`;

const ActionTitle = styled.div<{ hasIcon: boolean }>`
  margin-left: ${({ hasIcon }) => (hasIcon ? 16 : 0)}px;
`;
