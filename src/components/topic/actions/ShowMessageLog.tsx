import React, { useCallback, useState } from 'react';
import ChatBubble from 'src/components/svgs/chat_bubble.svg';
import { MessageLog } from 'src/components/topic/log/MessageLog';
import { ChatAction } from 'src/components/topic/actions/ChatAction';

export const ShowMessageLog = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <MessageLog
        onClose={useCallback(() => setIsVisible(false), [])}
        isVisible={isVisible}
      />
      <ChatAction
        message="ログを表示"
        onClick={useCallback(() => setIsVisible((prev) => !prev), [isVisible])}
        isActive={isVisible}
      >
        <ChatBubble />
      </ChatAction>
    </>
  );
};
