import Link from 'next/link';
import styled from 'styled-components';
import { useUserSelector } from 'src/data/redux/user/selector';
import React from 'react';
import Profile from 'src/components/svgs/profile.svg';

type Props = {
  linkTo: string;
  label: string;
  isActive?: boolean,
};

export const BottomNavigationButton: React.FC<Props> = ({
  linkTo,
  label,
  children,
  isActive = false,
}) => (
  <Link href={linkTo}>
    <LinkContainer isActive={isActive}>
      {children}
      <Label>{label}</Label>
    </LinkContainer>
  </Link>
);

type MyPageButtonProps = {
  current?: boolean;
  linkTo: string;
  label: string;
};

export const MyPageNavigationButton = ({
  linkTo,
  label,
  current,
}: MyPageButtonProps) => {
  const { photoUrl } = useUserSelector();
  return (
    <Link href={linkTo}>
      <LinkContainer isActive={current ?? false}>
        {photoUrl ? (
          <UserImage src={photoUrl} width={24} height={24} />
        ) : (
          <Profile fill={`${current ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,.6)'}`} />
        )}
        <Label>{label}</Label>
      </LinkContainer>
    </Link>
  );
};

const LinkContainer = styled.a<{ isActive: boolean }>`
  align-items: center;
  color: ${(props) => (props.isActive ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,.6)')};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  padding: 8px;

  & > svg {
    fill: ${(props) => (props.isActive ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,.6)')};
  }
`;

const Label = styled.div`
  font-size: 12px;
`;

const UserImage = styled.img`
  border-radius: 50%;
`;
