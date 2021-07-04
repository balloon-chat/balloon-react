import React, { useCallback } from 'react';
import { ChatAction } from 'src/components/topic/actions/ChatAction';
import ForumIcon from 'src/components/svgs/forum.svg';
import { useDispatch } from 'react-redux';
import { useChatState } from 'src/data/redux/chat/selector';
import { closeDerivedTopicsDialog, showDerivedTopicsDialog } from 'src/data/redux/chat/slice';

export const ShowAllDerivedTopic = () => {
  const dispatcher = useDispatch();
  const { dialog } = useChatState();

  const handleClick = useCallback(() => {
    if (dialog.derivedTopicsDialog) {
      dispatcher(closeDerivedTopicsDialog());
    } else {
      dispatcher(showDerivedTopicsDialog());
    }
  }, [dialog.derivedTopicsDialog]);

  return (
    <ChatAction
      message="すべての話題を表示"
      onClick={handleClick}
      isActive={dialog.derivedTopicsDialog}
    >
      <ForumIcon />
    </ChatAction>
  );
};
