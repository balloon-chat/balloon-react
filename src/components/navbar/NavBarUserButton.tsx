import React, { useState } from 'react';
import { useUserSelector } from 'src/data/redux/user/selector';
import styled from 'styled-components';
import { NavBarActionDialog } from 'src/components/navbar/NavBarActionDialog';

export const NavBarUserButton = () => {
  const { photoUrl } = useUserSelector();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Container>
      {photoUrl && <UserImage src={photoUrl} onClick={() => setIsOpen(!isOpen)} />}
      {isOpen && <NavBarActionDialog onClose={() => setIsOpen(false)} />}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const UserImage = styled.img`
  border-radius: 50%;
  cursor: pointer;
  height: 40px;
  padding: 4px;
`;
