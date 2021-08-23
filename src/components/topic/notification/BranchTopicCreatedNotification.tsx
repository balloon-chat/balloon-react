import { Button, OutlinedButton } from 'src/components/common/Button';
import { ChatNotification, ChatNotificationProps } from 'src/components/topic/notification/ChatNotification';
import React, { useCallback } from 'react';
import { useChatState } from 'src/data/redux/chat/selector';
import { BranchTopicCreatedPayload, ChatNotificationTypes } from 'src/data/redux/chat/state';
import { useDispatch } from 'react-redux';
import { clearNotification, notify } from 'src/data/redux/chat/slice';
import { rootPath } from 'src/view/route/pagePath';
import { useRouter } from 'next/router';

export const BranchTopicCreatedNotification = (props: ChatNotificationProps) => {
  const dispatcher = useDispatch();
  const router = useRouter();
  const { notification, topicId } = useChatState();

  const handleCancel = useCallback(() => {
    dispatcher(clearNotification());
  }, []);

  const handleOnPositiveClick = async () => {
    dispatcher(clearNotification());
    if (!notification || !topicId) return;
    const { branch } = notification.payload as BranchTopicCreatedPayload;
    await router.push(rootPath.topicPath.topicBranch(topicId, branch));
    dispatcher(notify({
      type: ChatNotificationTypes.SIMPLE_MESSAGE,
      message: null,
      title: '話題を移動しました',
      payload: {},
    }));
  };

  return (
    <>
      <ChatNotification {...props}>
        <OutlinedButton onClick={handleCancel}>ここに残る</OutlinedButton>
        <Button onClick={handleOnPositiveClick}>移動する</Button>
      </ChatNotification>
    </>
  );
};
