import React from 'react';
import { useMessageState } from 'src/data/redux/message/selector';
import { MessageLogItem } from 'src/components/topic/log/MessageLogItem';
import { SwipeInDialog } from 'src/components/common/SwipeInDialog';
import styled from 'styled-components';
import { imagePath } from 'src/components/constants/imagePath';
import { TextButton } from 'src/components/common/Button';

type Props = {
  isVisible: boolean,
  onClose: () => void,
}

export const MessageLog = ({ isVisible, onClose }: Props) => {
  const { messages } = useMessageState();

  return (
    <SwipeInDialog isVisible={isVisible} onClose={onClose}>
      <Container>
        {
          messages && messages.length !== 0
            ? messages.map((message, index) => <MessageLogItem key={index} message={message} />)
            : (
              <EmptyMessageContainer>
                <CharacterImage src={imagePath.character.blue} />
                <EmptyBranchTopicMessage>
                  しーんと静まり返っています
                  <br />
                  まずは『こんにちは』と挨拶しましょう！
                </EmptyBranchTopicMessage>
                <TextButton onClick={onClose}>閉じる</TextButton>
              </EmptyMessageContainer>
            )
        }
      </Container>
    </SwipeInDialog>
  );
};

const Container = styled.div`
  padding: 16px;
  height: 100%;

  & > div {
    margin-bottom: 16px;
  }

  & > div:last-child {
    margin-bottom: 0;
  }
`;

const EmptyMessageContainer = styled.div`
  align-items: center;
  align-content: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 16px;
  width: 100%;
  height: 100%;
  margin: auto 0;
`;

const CharacterImage = styled.img`
  width: 130px;
  height: 130px;
  object-fit: contain;
`;

const EmptyBranchTopicMessage = styled.div`
  text-align: center;
  margin-top: 16px;
`;
