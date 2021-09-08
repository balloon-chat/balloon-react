/* eslint-disable jsx-a11y/anchor-is-valid */
import styled from 'styled-components';
import React, { useCallback } from 'react';
import AddIcon from 'src/components/svgs/add.svg';
import ChatBubbleIcon from 'src/components/svgs/chat_bubble.svg';
import EditIcon from 'src/components/svgs/edit_fill.svg';
import ExitIcon from 'src/components/svgs/exit.svg';
import ForumIcon from 'src/components/svgs/forum.svg';
import CopyIcon from 'src/components/svgs/content_copy.svg';
import { TextButton } from 'src/components/common/Button';
import { rootPath, topicPath } from 'src/view/route/pagePath';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FullscreenContainer } from 'src/components/common/FullscreenContainer';
import { ZIndex } from 'src/components/constants/z_index';
import { useDispatch } from 'react-redux';
import { useChatState } from 'src/data/redux/chat/selector';
import {
  showBranchTopicsDialog as showBranchTopicsDialogAction,
  showDeriveTopicDialog as showDeriveTopicDialogAction,
  showMessageLog as showMessageLogAction,
} from 'src/data/redux/chat/slice';
import { useRouter } from 'next/router';
import { Transition } from 'react-transition-group';
import { fadeinAnimation, slideY } from 'src/components/common/Animations';

type Props = {
  isVisible: boolean,
  onClose: () => void,
  onCopyInvitation: () => void,
}

export const ChatActionBottomSheet = ({
  isVisible,
  onClose,
  onCopyInvitation,
}: Props) => {
  const router = useRouter();
  const dispatcher = useDispatch();
  const { topicId } = useChatState();
  const { invitation, isEditable } = useChatState();

  const showDeriveTopicDialog = useCallback(() => {
    onClose();
    dispatcher(showDeriveTopicDialogAction());
  }, []);

  const showBranchTopicsDialog = useCallback(() => {
    onClose();
    dispatcher(showBranchTopicsDialogAction());
  }, []);

  const showMessageLog = useCallback(() => {
    onClose();
    dispatcher(showMessageLogAction());
  }, []);

  return (
    <Transition in={isVisible} timeout={500} mountOnEnter unmountOnExit>
      {
        (status) => (
          <>
            <FullscreenContainer animate isVisible={status === 'entering' || status === 'entered'} onClick={onClose} />
            <Wrapper isVisible={isVisible}>
              <BottomSheet isVisible={status === 'entering' || status === 'entered'} duration={400}>
                <ActionContainer>
                  <BottomSheetAction onClick={showDeriveTopicDialog}>
                    話題を広げる
                    <AddIcon />
                  </BottomSheetAction>
                  <BottomSheetAction onClick={showBranchTopicsDialog}>
                    すべての話題を表示
                    <ForumIcon />
                  </BottomSheetAction>
                  <BottomSheetAction onClick={showMessageLog}>
                    ログを表示
                    <ChatBubbleIcon />
                  </BottomSheetAction>
                  <CopyToClipboard text={invitation ?? ''} onCopy={onCopyInvitation}>
                    <BottomSheetAction>
                      招待をコピー
                      <CopyIcon />
                    </BottomSheetAction>
                  </CopyToClipboard>
                  {
                  isEditable && topicId && (
                    <BottomSheetAction onClick={() => router.push(topicPath.edit(topicId))}>
                      話題を編集
                      <EditIcon />
                    </BottomSheetAction>
                  )
                }
                </ActionContainer>
                <ActionContainer>
                  <BottomSheetAction onClick={() => router.push(rootPath.index)}>
                    退出
                    <ExitIcon />
                  </BottomSheetAction>
                </ActionContainer>
                <CancelButton onClick={onClose}>閉じる</CancelButton>
              </BottomSheet>
            </Wrapper>
          </>
        )
      }
    </Transition>
  );
};

const Wrapper = styled.div<{ isVisible: boolean }>`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${ZIndex.dialog};
`;

const BottomSheet = styled.div<{ isVisible: boolean, duration: number }>`
  background-color: #f7f7f8;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  margin: 4px;
  padding: 16px 8px;
  
  animation: ${({ duration }) => duration}ms ${slideY(800, 0)}, ${({ duration }) => duration}ms ${fadeinAnimation} ;
  transition: all ${({ duration }) => duration}ms ease-in-out;
  transform: translateY(${(props) => (props.isVisible ? 0 : 800)}px);

  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
`;

const ActionContainer = styled.ul`
  background-color: white;
  border-radius: 5px;
  padding: 0 16px;
  margin: 8px 0;
`;

const BottomSheetAction = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  cursor: pointer;

  & > svg {
    fill: #555;
    width: 24px;
    height: 24px;
  }
`;

const CancelButton = styled(TextButton)`
  align-self: center;
  margin-bottom: 8px;
`;
