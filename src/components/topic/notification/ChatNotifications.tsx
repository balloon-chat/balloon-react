import React, { useEffect, useState } from 'react';
import { BranchTopicCreatedNotification } from 'src/components/topic/notification/BranchTopicCreatedNotification';
import { SimpleMessageNotification } from 'src/components/topic/notification/SimpleMessageNotification';
import { useChatState } from 'src/data/redux/chat/selector';
import { ChatNotificationTypes } from 'src/data/redux/chat/state';
import { InvitationNotification } from 'src/components/topic/notification/InvitationNotification';

export const ChatNotifications = () => {
  const [message, setMessage] = useState<string>();
  const [title, setTitle] = useState<string>('');
  const { notification } = useChatState();

  useEffect(() => {
    if (notification) {
      setTitle(notification.title);
      setMessage(notification.message);
    }
  }, [notification?.type]);

  return (
    <>
      <InvitationNotification
        isVisible={notification?.type === ChatNotificationTypes.INVITATION}
        title={title}
        message={message}
      />
      <BranchTopicCreatedNotification
        isVisible={notification?.type === ChatNotificationTypes.BRANCH_TOPIC_CREATED}
        title={title}
        message={message}
      />
      <SimpleMessageNotification
        isVisible={notification?.type === ChatNotificationTypes.SIMPLE_MESSAGE}
        title={title}
        message={message}
      />
    </>
  );
};
