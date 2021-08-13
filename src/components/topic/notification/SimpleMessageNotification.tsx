import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearNotification } from 'src/data/redux/chat/slice';
import { ChatNotification } from 'src/components/topic/notification/ChatNotification';

type Props = {
  isVisible: boolean,
  title?: string,
  message: string,
}

export const SimpleMessageNotification = ({
  isVisible,
  title,
  message,
}: Props) => {
  const dispatcher = useDispatch();

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        dispatcher(clearNotification());
      }, 5000);
    }
  }, [isVisible]);

  return (
    <ChatNotification
      visible={isVisible}
      title={title}
      message={message}
    />
  );
};
