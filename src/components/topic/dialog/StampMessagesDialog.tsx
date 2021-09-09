import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { SwipeInDialog } from 'src/components/common/SwipeInDialog';
import { useChatState } from 'src/data/redux/chat/selector';
import { closeStampDialog } from 'src/data/redux/chat/slice';
import styled from 'styled-components';
import { sendMessage } from 'src/data/redux/message/action';
import { useUserSelector } from 'src/data/redux/user/selector';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import { stamps } from 'src/components/constants/stamps';

/**
 * テンプレートとして、表示するとキャラクターの表情のようになるメッセージ一覧を表示。
 */
export const StampMessagesDialog = () => {
  const dispatcher = useDispatch();
  const { uid } = useUserSelector();
  const {
    dialog,
    topicId,
  } = useChatState();

  const handleClose = useCallback(() => {
    dispatcher(closeStampDialog());
  }, []);

  const onClickHandler = useCallback((message: string) => {
    dispatcher(closeStampDialog());

    if (!uid || !topicId) return;
    dispatcher(sendMessage({
      userId: uid,
      message,
      topicId,
    }));
  }, [uid, topicId]);

  return (
    <SwipeInDialog onClose={handleClose} isVisible={dialog.stamp}>
      <Container>
        <DialogHeader>
          <DialogTitle>スタンプ</DialogTitle>
          <DialogDescription>タップすると送信できます</DialogDescription>
        </DialogHeader>
        <StampItemList>
          {
              stamps.map((stamp, index) => (
                <StampItem
                  {...stamp}
                  key={index}
                  onClick={onClickHandler}
                />
              ))
            }
        </StampItemList>
      </Container>
    </SwipeInDialog>
  );
};

const StampItem = ({
  title,
  imageUrl,
  message,
  onClick,
}: {
  title: string,
  imageUrl: string,
  message: string,
  onClick: (message: string) => void
}) => (
  <StampItemContainer onClick={() => onClick(message)}>
    <StampImage src={imageUrl} />
    <div>{title}</div>
  </StampItemContainer>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const DialogHeader = styled.div`
  margin-top: 16px;
  margin-left: 16px;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    margin-top: 0;
  }
`;

const DialogTitle = styled.div`
  font-weight: bold;
  font-size: 1.25rem;
`;

const DialogDescription = styled.div`
  color: rgba(0, 0, 0, .6);
`;

const StampItemList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StampItemContainer = styled.div`
  box-sizing: border-box;
  cursor: pointer;
  color: rgba(0, 0, 0, .8);
  display: flex;
  flex-direction: column;
  font-weight: bold;
  width: calc(100% / 2 - 4px);
  padding: 16px;
  text-align: center;
  height: 160px;

  :hover {
    background-color: rgba(0, 0, 0, .05);
    border-radius: 10px;
  }

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    // タブレット以上の場合は、3列
    width: calc(100% / 3 - 4px);
  }
`;

const StampImage = styled.img`
  border-radius: 10%;
  margin-bottom: 4px;
  height: 100%; // safariの場合、この指定が無いと表示がおかしくなる。
`;
