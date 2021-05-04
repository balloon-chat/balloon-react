import React from 'react';
import { useUserSelector } from 'src/data/redux/user/selector';
import styled from 'styled-components';
import Link from 'next/link';
import { rootPath } from 'src/view/route/pagePath';

export const NavBarUserButton = () => {
  const { uid, photoUrl } = useUserSelector();
  return (
    <>
      {
        uid && photoUrl
        && (
        <Link href={rootPath.usersPath.user(uid)}>
          <UserImage src={photoUrl} />
        </Link>
        )
      }
    </>
  );
};

const UserImage = styled.img`
  border-radius: 50%;
  cursor: pointer;
  height: 40px;
  padding: 4px;
`;
