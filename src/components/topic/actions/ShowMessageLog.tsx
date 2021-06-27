import React, { useCallback } from 'react';
import ChatBubble from 'src/components/svgs/chat_bubble.svg';
import { ChatAction } from 'src/components/topic/actions/ChatAction';
import { useDispatch } from 'react-redux';
import { useChatState } from 'src/data/redux/chat/selector';
import { closeMessageLog, showMessageLog } from 'src/data/redux/chat/slice';

export const ShowMessageLog = () => {
  const dispatcher = useDispatch();
  const { dialog } = useChatState();

  const onClickHandler = useCallback(() => {
    if (dialog.messageLog) {
      dispatcher(closeMessageLog());
    } else {
      dispatcher(showMessageLog());
    }
  }, [dialog.deriveTopicDialog]);

  return (
    <ChatAction
      message="ログを表示"
      onClick={onClickHandler}
      isActive={dialog.messageLog}
    >
      <ChatBubble />
    </ChatAction>
  );
};
