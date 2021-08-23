import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearNotification } from 'src/data/redux/chat/slice';
import { ChatNotification, ChatNotificationProps } from 'src/components/topic/notification/ChatNotification';

export const SimpleMessageNotification = (props: ChatNotificationProps) => {
  const dispatcher = useDispatch();
  const { isVisible } = props;

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        dispatcher(clearNotification());
      }, 5000);
    }
  }, [isVisible]);

  return (
    <ChatNotification {...props} />
  );
};
