import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { ParsedUrlQueryInput } from 'querystring';
import React from 'react';

type Props = {
  title: string;
  imgSrc?: string;
  link: string;
  linkQuery?: string | ParsedUrlQueryInput;
};

export const NavButton = ({ title, imgSrc, link, linkQuery }: Props) => (
  <Link href={{ pathname: link, query: linkQuery }}>
    <NavButtonContainer>
      {imgSrc && <Image height={20} width={20} src={imgSrc} />}
      <ActionTitle hasIcon={imgSrc !== undefined}>{title}</ActionTitle>
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
`;

const ActionTitle = styled.div<{ hasIcon: boolean }>`
  margin-left: ${({ hasIcon }) => (hasIcon ? 16 : 0)}px;
`;
