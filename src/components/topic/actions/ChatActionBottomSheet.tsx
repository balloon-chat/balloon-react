import styled from 'styled-components';
import React from 'react';
import AddIcon from 'src/components/svgs/add.svg';
import ChatBubbleIcon from 'src/components/svgs/chat_bubble.svg';
import EditIcon from 'src/components/svgs/edit_fill.svg';
import ExitIcon from 'src/components/svgs/exit.svg';
import MailIcon from 'src/components/svgs/mail.svg';
import { TextButton } from 'src/components/common/Button';
import { rootPath, topicPath } from 'src/view/route/pagePath';
import Link from 'next/link';
import { useTopicState } from 'src/data/redux/topic/selector';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FullscreenContainer } from 'src/components/common/FullscreenContainer';

type Props = {
  isVisible: boolean,
  onClose: () => void,
  onShowLog: () => void,
  invitation: string,
  isEditable: boolean,
}

export const ChatActionBottomSheet = ({
  isVisible,
  isEditable,
  invitation,
  onClose,
  onShowLog,
}: Props) => {
  const { currentTopic } = useTopicState();
  return (
    <>
      <FullscreenContainer isVisible={isVisible} onClick={onClose} />
      <Wrapper isVisible={isVisible}>
        <BottomSheet isVisible={isVisible}>
          <ActionContainer>
            <BottomSheetAction>
              話題を広げる
              <AddIcon />
            </BottomSheetAction>
            <BottomSheetAction onClick={onShowLog}>
              ログを表示
              <ChatBubbleIcon />
            </BottomSheetAction>
            <CopyToClipboard text={invitation} onCopy={onClose}>
              <BottomSheetAction>
                招待をコピー
                <MailIcon />
              </BottomSheetAction>
            </CopyToClipboard>
            {
              isEditable && currentTopic && (
                <Link href={topicPath.edit(currentTopic.id)}>
                  <BottomSheetAction>
                    話題を編集
                    <EditIcon />
                  </BottomSheetAction>
                </Link>
              )
            }
          </ActionContainer>
          <ActionContainer>
            <Link href={rootPath.index}>
              <BottomSheetAction>
                退出
                <ExitIcon />
              </BottomSheetAction>
            </Link>
          </ActionContainer>
          <CancelButton onClick={onClose}>閉じる</CancelButton>
        </BottomSheet>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div<{ isVisible: boolean }>`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
`;

const BottomSheet = styled.div<{ isVisible: boolean }>`
  background-color: #f7f7f8;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  margin: 4px;
  padding: 16px 8px;
  transition: all 0.4s ease-in-out;
  transform: translateY(${(props) => (props.isVisible ? 0 : 80)}vh);

  position: absolute;
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
