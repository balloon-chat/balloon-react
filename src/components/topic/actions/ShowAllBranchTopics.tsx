import React, { useCallback } from 'react';
import { ChatAction } from 'src/components/topic/actions/ChatAction';
import ForumIcon from 'src/components/svgs/forum.svg';
import { useDispatch } from 'react-redux';
import { useChatState } from 'src/data/redux/chat/selector';
import { closeBranchTopicsDialog, showBranchTopicsDialog } from 'src/data/redux/chat/slice';

export const ShowAllBranchTopics = () => {
  const dispatcher = useDispatch();
  const { dialog } = useChatState();

  const handleClick = useCallback(() => {
    if (dialog.branchTopicDialog) {
      dispatcher(closeBranchTopicsDialog());
    } else {
      dispatcher(showBranchTopicsDialog());
    }
  }, [dialog.branchTopicDialog]);

  return (
    <ChatAction
      message="話題を表示"
      onClick={handleClick}
      isActive={dialog.branchTopicDialog}
    >
      <ForumIcon />
    </ChatAction>
  );
};
