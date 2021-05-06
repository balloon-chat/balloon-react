import Link from 'next/link';
import styled from 'styled-components';
import React from 'react';
import { ParsedUrlQueryInput } from 'querystring';

type Props = {
  linkTo: string;
  label: string;
  linkQuery?: string | ParsedUrlQueryInput,
  isActive?: boolean,
};

export const BottomNavigationButton: React.FC<Props> = ({
  linkTo,
  label,
  children,
  linkQuery,
  isActive = false,
}) => (
  <Link href={{
    pathname: linkTo,
    query: linkQuery,
  }}
  >
    <LinkContainer isActive={isActive}>
      {children}
      <Label>{label}</Label>
    </LinkContainer>
  </Link>
);

const LinkContainer = styled.a<{ isActive: boolean }>`
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
    fill: rgba(0,0,0,.6);
  }
`;

const Label = styled.div`
  font-size: 12px;
`;
