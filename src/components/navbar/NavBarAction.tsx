import styled from 'styled-components';
import Link from 'next/link';
import { ParsedUrlQueryInput } from 'querystring';
import React from 'react';

type Props = {
  title: string;
  link: string;
  linkQuery?: string | ParsedUrlQueryInput;
};

export const NavButton = ({
  title,
  link,
  linkQuery,
}: Props) => (
  <Link href={{ pathname: link, query: linkQuery }}>
    <NavButtonContainer>
      <ActionTitle>{title}</ActionTitle>
    </NavButtonContainer>
  </Link>
);

const NavButtonContainer = styled.a`
  align-items: center;
  display: flex;
  color: inherit;
  font-size: 16px;
  justify-content: center;
  padding: 8px 16px;
  letter-spacing: 0.25px;
  text-align: center;
  text-decoration: none;

  & > svg {
    fill: currentColor;
  }
`;

const ActionTitle = styled.div`
  box-sizing: border-box;
  white-space: nowrap;
`;
