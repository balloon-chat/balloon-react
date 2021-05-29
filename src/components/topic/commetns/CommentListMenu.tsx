import React, { useCallback, useState } from 'react';
import MenuIcon from 'src/components/svgs/menu.svg';
import styled from 'styled-components';
import { CommentList } from 'src/components/topic/commetns/CommentList';

export const CommentListMenu = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <CommentList
        onClose={useCallback(() => setIsVisible(false), [])}
        isVisible={isVisible}
      />
      <MenuIconContainer
        onClick={useCallback(() => setIsVisible((prev) => !prev), [])}
        isVisible={isVisible}
      >
        <MenuIcon />
      </MenuIconContainer>
    </>
  );
};

const MenuIconContainer = styled.div<{isVisible: boolean}>`
  align-items: center;
  border: 1px solid rgba(0,0,0,.3);
  border-radius: 100%;
  color: rgba(0,0,0,.75);
  cursor: pointer;
  display: flex;
  min-width: 36px;
  min-height: 36px;
  justify-content: center;
  position: relative;
  
  & > svg {
    fill: ${(props) => (props.isVisible ? '#5b87fa' : undefined)};
  }
`;
