import React, { useCallback } from 'react';
import { ChatAction } from 'src/components/topic/actions/ChatAction';
import styled from 'styled-components';
import { ChatActionDialog } from 'src/components/topic/dialog/ChatActionDialog';
import { ChatActionBottomSheet } from 'src/components/topic/dialog/ChatActionBottomSheet';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import { useDispatch } from 'react-redux';
import { useChatState } from 'src/data/redux/chat/selector';
import {
  clearNotification,
  closeDetailActionDialog,
  notify,
  showDetailActionDialog,
} from 'src/data/redux/chat/slice';
import { ChatNotificationTypes } from 'src/data/redux/chat/state';

/**
 * メッセージ入力欄に表示されるアクションボタンの一つで、
 * 詳細な操作をまとめたダイアログを表示する
 */
export const DetailActions = () => {
  const dispatcher = useDispatch();
  const { dialog } = useChatState();

  const handleOnClickButton = useCallback(() => {
    if (dialog.detailAction) {
      dispatcher(closeDetailActionDialog());
    } else {
      dispatcher(showDetailActionDialog());
    }
  }, [dialog.detailAction]);

  return (
    <div style={{ position: 'relative' }}>
      <ActionDialog />
      <ChatAction onClick={handleOnClickButton} isActive={dialog.detailAction} message="詳細">
        <DotContainer isActive={dialog.detailAction}>
          <Dot />
          <Dot />
          <Dot />
        </DotContainer>
      </ChatAction>
    </div>
  );
};

const Dot = styled.span`
  width: 5px;
  height: 5px;
  margin: 1px;
  display: inline-block;
  border-radius: 100%;
`;

const DotContainer = styled.div<{isActive: boolean}>`
  & ${Dot} {
    border: 1px solid ${(props) => (props.isActive ? '#5b87fa' : '#555')};
    background-color: ${(props) => (props.isActive ? '#5b87fa' : '#555')};
  }
`;

/**
 * 詳細アクションのダイアログ
 * モバイル版とタブレット以上の端末とで、実際に表示されるダイアログを切り分ける
 */
const ActionDialog = () => {
  const dispatcher = useDispatch();
  const { dialog } = useChatState();

  const handleOnCLose = useCallback(() => {
    dispatcher(closeDetailActionDialog());
  }, []);

  const handleOnCopyInvitation = useCallback(() => {
    // ダイアログを閉じる
    dispatcher(closeDetailActionDialog());

    // 招待をコピーしたことを通知
    dispatcher(clearNotification());
    dispatcher(notify({
      type: ChatNotificationTypes.SIMPLE_MESSAGE,
      title: '招待をコピーしました',
      message: '',
      payload: {},
    }));
  }, []);

  return (
    <>
      <MobileDialog>
        <ChatActionBottomSheet
          isVisible={dialog.detailAction}
          onCopyInvitation={handleOnCopyInvitation}
          onClose={handleOnCLose}
        />
      </MobileDialog>
      <TabletDialog>
        <ChatActionDialog
          isVisible={dialog.detailAction}
          onCopyInvitation={handleOnCopyInvitation}
          onClose={handleOnCLose}
        />
      </TabletDialog>
    </>
  );
};

const MobileDialog = styled.div`
  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    & > div {
      visibility: hidden;
      position: fixed;
      background-color: white;
      user-select: none;
    }
  }
`;

const TabletDialog = styled.div`
  @media screen and (max-width: ${mediaQuery.tablet.portrait}px) {
    & > div {
      visibility: hidden;
      position: fixed;
      user-select: none;
    }
  }
`;
