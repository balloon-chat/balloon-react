import AddIcon from 'src/components/svgs/add.svg';
import React, { useCallback } from 'react';
import { ChatAction } from 'src/components/topic/actions/ChatAction';
import { useDispatch } from 'react-redux';
import { useChatState } from 'src/data/redux/chat/selector';
import { closeDerivedTopicDialog, showDeriveTopicDialog } from 'src/data/redux/chat/slice';

export const DeriveTopic = () => {
  const dispatcher = useDispatch();
  const { dialog } = useChatState();

  const onClickHandler = useCallback(() => {
    if (dialog.deriveTopicDialog) {
      dispatcher(closeDerivedTopicDialog());
    } else {
      dispatcher(showDeriveTopicDialog());
    }
  }, [dialog.deriveTopicDialog]);

  return (
    <ChatAction
      onClick={onClickHandler}
      isActive={dialog.deriveTopicDialog}
      message="話題を広げる"
    >
      <AddIcon />
    </ChatAction>
  );
};
