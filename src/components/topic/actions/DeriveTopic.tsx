import AddIcon from 'src/components/svgs/add.svg';
import React, { useCallback } from 'react';
import { ChatAction } from 'src/components/topic/actions/ChatAction';
import { useDispatch } from 'react-redux';
import { useChatState } from 'src/data/redux/chat/selector';
import { closeDeriveTopicDialog, showDeriveTopicDialog } from 'src/data/redux/chat/slice';

/**
 * メッセージ入力欄に表示されるアクションボタンの一つで、
 * 話題の派生を行う。
 */
export const DeriveTopic = () => {
  const dispatcher = useDispatch();
  const { dialog } = useChatState();

  const onClickHandler = useCallback(() => {
    if (dialog.deriveTopicDialog) {
      dispatcher(closeDeriveTopicDialog());
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
