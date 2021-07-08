import { Button, TextButton } from 'src/components/common/Button';
import { ChatNotification } from 'src/components/topic/notification/ChatNotification';
import React, { useCallback, useEffect, useState } from 'react';
import { useChatState } from 'src/data/redux/chat/selector';
import { BranchTopicCreatedPayload, ChatNotificationTypes } from 'src/data/redux/chat/state';
import { useDispatch } from 'react-redux';
import { clearNotification } from 'src/data/redux/chat/slice';
import { rootPath } from 'src/view/route/pagePath';
import { useRouter } from 'next/router';

export const BranchTopicCreatedNotification = () => {
  const dispatcher = useDispatch();
  const router = useRouter();
  const { notification, topicId } = useChatState();
  const [visible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (notification?.type === ChatNotificationTypes.BRANCH_TOPIC_CREATED) {
      setIsVisible(true);

      // メッセージをキャッシュしておく
      if (notification.title) setTitle(notification?.title);
      setMessage(notification.message);
    } else {
      setIsVisible(false);
    }
  }, [notification?.type]);

  const handleCancel = useCallback(() => {
    dispatcher(clearNotification());
  }, []);

  const handleOnPositiveClick = async () => {
    dispatcher(clearNotification());
    if (!notification || !topicId) return;
    const { branch } = notification.payload as BranchTopicCreatedPayload;
    await router.push(rootPath.topicPath.topicBranch(topicId, branch));
  };

  return (
    <>
      <ChatNotification
        visible={visible}
        title={title}
        message={message}
      >
        <TextButton onClick={handleCancel}>ここに残る</TextButton>
        <Button onClick={handleOnPositiveClick}>移動する</Button>
      </ChatNotification>
    </>
  );
};
