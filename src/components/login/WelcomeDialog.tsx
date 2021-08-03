import { Dialog } from 'src/components/common/Dialog';
import { Button, TextButton } from 'src/components/common/Button';
import React from 'react';
import styled from 'styled-components';
import { AvatarImage } from 'src/components/common/AvatarImage';

type Props = {
  name: string,
  imgUrl: string,
  onEdit: () => void,
  onCreateUser: () => void
}

export const WelcomeDialog = ({ name, imgUrl, onEdit, onCreateUser }: Props) => (
  <Dialog isVisible onClose={() => {}}>
    <Title>Welcome!</Title>
    <Title>{`${name} さん`}</Title>
    <ProfileImageContainer>
      <AvatarImage size={126} floating src={imgUrl} />
    </ProfileImageContainer>
    <ActionRow>
      <TextButton onClick={onEdit}>内容を修正</TextButton>
      <Button onClick={onCreateUser}>アカウントを作成</Button>
    </ActionRow>
  </Dialog>
);

const Title = styled.h1`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const ProfileImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 24px 0;
  width: 100%;
`;

const ActionRow = styled.div`
  display: flex;
  margin-top: 16px;
  justify-content: flex-end;
  width: 100%;
`;
