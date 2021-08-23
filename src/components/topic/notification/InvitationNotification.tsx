import React, { useCallback } from 'react';
import { Button, OutlinedButton } from 'src/components/common/Button';
import { useChatState } from 'src/data/redux/chat/selector';
import CopyToClipboard from 'react-copy-to-clipboard';
import { ChatNotification } from 'src/components/topic/notification/ChatNotification';
import { useDispatch } from 'react-redux';
import { clearNotification, notify } from 'src/data/redux/chat/slice';
import { ChatNotificationTypes } from 'src/data/redux/chat/state';

type Props = {
  isVisible: boolean,
  title?: string,
  message: string,
}

export const InvitationNotification = ({ isVisible, title, message }: Props) => {
  const dispatcher = useDispatch();
  const { invitation } = useChatState();

  const handleOnCopy = useCallback(() => {
    dispatcher(clearNotification());
    dispatcher(notify({
      type: ChatNotificationTypes.SIMPLE_MESSAGE,
      title: '招待をコピーしました',
      message: '',
      payload: {},
    }));
  }, []);

  const handleClose = useCallback(() => {
    dispatcher(clearNotification());
  }, []);

  return (
    <ChatNotification title={title} message={message} visible={isVisible}>
      <CopyToClipboard text={invitation ?? ''} onCopy={handleOnCopy}>
        <Button>招待をコピー</Button>
      </CopyToClipboard>
      <OutlinedButton onClick={handleClose}>閉じる</OutlinedButton>
    </ChatNotification>
  );
};
