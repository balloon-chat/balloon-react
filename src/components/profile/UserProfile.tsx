import React from 'react';
import styled from 'styled-components';
import { UserEntity } from 'src/view/types/user';
import { imagePath } from 'src/components/constants/imagePath';

export const UserProfile = ({
  photoUrl,
  name,
}: UserEntity) => (
  <Container>
    <UserIcon src={photoUrl ?? imagePath.character.blue} />
    <UserName>{name}</UserName>
  </Container>
);

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const UserIcon = styled.img`
  border-radius: 50%;
  object-fit: contain;
  width: 120px;
  height: 120px;
`;

const UserName = styled.h1`
  font-size: 32px;
  margin-top: 8px;
`;
