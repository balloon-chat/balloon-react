import React from 'react';
import styled from 'styled-components';
import { useUserSelector } from 'src/data/redux/user/selector';
import { useRouter } from 'next/router';
import { rootPath } from 'src/view/route/pagePath';

type Props = {
  onClose: () => void
}

export const NavBarActionDialog = ({ onClose }:Props) => {
  const {
    photoUrl,
    name,
    uid,
  } = useUserSelector();

  const router = useRouter();

  const navigateToProfile = async () => {
    if (!uid) return;
    await router.push(rootPath.usersPath.user(uid));
  };

  const logout = async () => {
    await router.push(rootPath.logout);
  };

  return (
    <>
      <FullScreenContainer onClick={onClose} />
      <Container>
        <ProfileContainer>
          <UserIcon src={photoUrl ?? ''} onClick={navigateToProfile} />
          <UserName>{name}</UserName>
        </ProfileContainer>
        <Separator />
        <ActionButton onClick={navigateToProfile}>プロフィール</ActionButton>
        <Separator />
        <ActionButton onClick={logout}>ログアウト</ActionButton>
      </Container>
    </>
  );
};

const FullScreenContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const Container = styled.ul`
  background-color: white;
  border-radius: 5px;
  border: 1px rgba(0, 0, 0, .1) solid;
  box-sizing: border-box;
  box-shadow: 0 10px 10px -2px rgb(0 64 128 / 20%);
  padding: 16px 0;
  width: 216px;
  z-index: 100;
  position: absolute;
  right: 0;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 16px;
`;

const UserIcon = styled.img`
  border-radius: 50%;
  cursor: pointer;
  width: 64px;
  height: 64px;
  object-fit: cover;
`;

const UserName = styled.div`
  font-weight: bold;
  margin-top: 8px;
`;

const Separator = styled.div`
  height: 16px;
  width: 100%;
`;

const ActionButton = styled.li`
  box-sizing: border-box;
  cursor: pointer;
  width: 100%;
  padding: 8px 16px;

  &:hover {
    background-color: rgba(0, 0, 0, .1);
  }
`;
