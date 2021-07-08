import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { rootPath, topicPath } from 'src/view/route/pagePath';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FullscreenContainer } from 'src/components/common/FullscreenContainer';
import { ZIndex } from 'src/components/constants/z_index';
import { useChatState } from 'src/data/redux/chat/selector';

type Props = {
  isVisible: boolean,
  onClose: () => void,
}

export const ChatActionDialog = ({
  isVisible,
  onClose,
}: Props) => {
  const { topicId } = useChatState();
  const { invitation, isEditable } = useChatState();
  return (
    <>
      <FullscreenContainer
        transparent
        isVisible={isVisible}
        onClick={() => onClose()}
      />
      <DialogContainer isVisible={isVisible}>
        <Dialog>
          <CopyToClipboard
            text={invitation ?? ''}
            onCopy={onClose}
          >
            <li>招待をコピー</li>
          </CopyToClipboard>
          {
            isEditable && topicId && (
              <Link href={topicPath.edit(topicId)}>
                <li>話題を編集</li>
              </Link>
            )
          }
          <Link href={rootPath.index}><li>退出</li></Link>
        </Dialog>
      </DialogContainer>
    </>
  );
};

const DialogContainer = styled.div<{isVisible: boolean}>`
  width: 100vw;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')};
`;

const Dialog = styled.ul`
  background-color: white;
  border-radius: 5px;
  border: 1px rgba(0, 0, 0, .1) solid;
  box-shadow: 0 10px 10px -2px rgb(0 64 128 / 15%);
  z-index: ${ZIndex.dialog};
  margin: 0;
  transform: translateY(-100%);
  padding: 0;
  position: absolute;
  right: 0;
  top: -16px;

  & > li {
    list-style: none;
    box-sizing: border-box;
    display: block;
    cursor: pointer;
    line-height: 48px;
    padding: 0 80px 0 20px;
    width: 100%;
  }

  & > li:hover {
    background-color: #e9f2f9;
  }
`;
