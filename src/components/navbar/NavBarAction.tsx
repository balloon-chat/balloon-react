import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { ParsedUrlQueryInput } from 'querystring';

type Props = {
  title: string,
  imgSrc?: string,
  link: string,
  linkQuery?: string | ParsedUrlQueryInput,
};

// tslint:disable-next-line:variable-name
export const NavButton = ({ title, imgSrc, link, linkQuery }: Props) => {
  return (<Link href={{ pathname: link, query: linkQuery }}>
    <NavButtonContainer>
      {imgSrc && <Image height={20} width={20} src={imgSrc}/>}
      <ActionTitle hasIcon={imgSrc !== undefined}>{title}</ActionTitle>
    </NavButtonContainer>
  </Link>);
};

// tslint:disable-next-line:variable-name
const NavButtonContainer = styled.div`
  align-items: center;
  display: flex;
  color: inherit;
  font-size: 16px;
  justify-content: center;
  padding: 8px 16px;
  letter-spacing: .25px;
  text-align: center;
  text-decoration: none;

  &:hover {
    background-color: rgba(0, 0, 0, .1);
    cursor: pointer;
  }
`;

// tslint:disable-next-line:variable-name
const ActionTitle = styled.div<{ hasIcon: boolean }>`
  margin-left: ${({ hasIcon }) => hasIcon ? 16 : 0}px;
`;
