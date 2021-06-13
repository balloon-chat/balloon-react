import React, { useCallback, useState } from 'react';
import ChatBubble from 'src/components/svgs/chat_bubble.svg';
import styled from 'styled-components';
import { MessageLog } from 'src/components/topic/chat/MessageLog';

export const MessageLogMenu = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <MessageLog
        onClose={useCallback(() => setIsVisible(false), [])}
        isVisible={isVisible}
      />
      <MenuIconContainer
        onClick={useCallback(() => setIsVisible((prev) => !prev), [])}
        isVisible={isVisible}
      >
        <ChatBubble />
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
