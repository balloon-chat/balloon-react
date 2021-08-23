import { Button, OutlinedButton } from 'src/components/common/Button';
import { ChatNotification } from 'src/components/topic/notification/ChatNotification';
import React, { useCallback } from 'react';
import { useChatState } from 'src/data/redux/chat/selector';
import { BranchTopicCreatedPayload, ChatNotificationTypes } from 'src/data/redux/chat/state';
import { useDispatch } from 'react-redux';
import { clearNotification, notify } from 'src/data/redux/chat/slice';
import { rootPath } from 'src/view/route/pagePath';
import { useRouter } from 'next/router';

type Props = {
  isVisible: boolean,
  title?: string,
  message: string,
}

export const BranchTopicCreatedNotification = ({
  isVisible,
  title,
  message,
}: Props) => {
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
      message: '話題を移動しました！',
      title: null,
      payload: {},
    }));
  };

  return (
    <>
      <ChatNotification
        visible={isVisible}
        title={title}
        message={message}
      >
        <OutlinedButton onClick={handleCancel}>ここに残る</OutlinedButton>
        <Button onClick={handleOnPositiveClick}>移動する</Button>
      </ChatNotification>
    </>
  );
};
