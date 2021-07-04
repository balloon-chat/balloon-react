import { Button, TextButton } from 'src/components/common/Button';
import { ChatNotification } from 'src/components/topic/notification/ChatNotification';
import React, { useCallback, useEffect, useState } from 'react';
import { useChatState } from 'src/data/redux/chat/selector';
import { ChatNotificationTypes } from 'src/data/redux/chat/state';
import { useDispatch } from 'react-redux';
import { clearNotification } from 'src/data/redux/chat/slice';

export const DerivedTopicCreatedNotification = () => {
  const dispatcher = useDispatch();
  const { notification } = useChatState();
  const [visible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (notification?.type === ChatNotificationTypes.DERIVED_TOPIC_CREATED) {
      setIsVisible(true);
      // メッセージをキャッシュしておく
      setMessage(notification.message);
    } else {
      setIsVisible(false);
    }
  }, [notification?.type]);

  const handleCancel = useCallback(() => {
    dispatcher(clearNotification());
  }, []);

  const handleOnPositiveClick = useCallback(() => {
    console.log('CLICKED');
  }, []);

  return (
    <>
      <ChatNotification visible={visible} message={message}>
        <TextButton onClick={handleCancel}>ここに残る</TextButton>
        <Button onClick={handleOnPositiveClick}>移動する</Button>
      </ChatNotification>
    </>
  );
};
