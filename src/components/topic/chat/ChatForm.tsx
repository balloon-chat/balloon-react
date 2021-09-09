import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendMessage as sendMessageAction } from 'src/data/redux/message/action';
import { useUserSelector } from 'src/data/redux/user/selector';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import Send from 'src/components/svgs/send.svg';
import { ShowMessageLog } from 'src/components/topic/actions/ShowMessageLog';
import { DeriveTopic } from 'src/components/topic/actions/DeriveTopic';
import { DetailActions } from 'src/components/topic/actions/DetailActions';
import { useChatState } from 'src/data/redux/chat/selector';
import { ShowAllBranchTopics } from 'src/components/topic/actions/ShowAllBranchTopics';
import { MessageBody } from 'src/domain/message/models/messageBody';
import { notify, setIsInputting } from 'src/data/redux/chat/slice';
import { ChatNotificationTypes } from 'src/data/redux/chat/state';
import { ChatNotifications } from 'src/components/topic/notification/ChatNotifications';
import { StampMessage } from 'src/components/topic/actions/StampMessage';

export const ChatForm = () => {
  const dispatcher = useDispatch();
  const { topicId, branchTopicId } = useChatState();
  const { uid } = useUserSelector();
  const [text, setText] = useState('');
  const [isTextOverflow, setIsTextOverflow] = useState(false);
  const [canSend, setCanSend] = useState(false); // メッセージを送信可能か

  useEffect(() => {
    setIsTextOverflow(text.length > MessageBody.MAX_MESSAGE_SIZE);
    dispatcher(setIsInputting({ value: text !== '' }));
  }, [text]);

  useEffect(() => {
    setCanSend(text !== '' && !isTextOverflow);
  }, [text, isTextOverflow]);

  useEffect(() => {
    if (isTextOverflow) {
      dispatcher(notify({
        type: ChatNotificationTypes.SIMPLE_MESSAGE,
        title: 'エラー',
        message: `送信できるメッセージは${MessageBody.MAX_MESSAGE_SIZE}文字以内です！`,
        payload: {},
      }));
    }
  }, [isTextOverflow]);

  const handleInput = (value: string | null) => {
    if (value) setText(value);
  };

  // Formの送信イベント
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(text);
  };

  // 送信アイコンのクリックハンドラ
  const handleSend = () => { sendMessage(text); };

  const sendMessage = (message: string) => {
    if (isTextOverflow) return;

    if (topicId && uid && message) {
      dispatcher(sendMessageAction({
        message,
        userId: uid,
        topicId: branchTopicId ?? topicId,
      }));
    }
    setText('');
  };

  return (
    <Container>
      <ActionContainer>
        <DeriveTopic />
        <ShowAllBranchTopics />
      </ActionContainer>
      <StampMessage />
      <MessageForm onSubmit={(e) => handleSubmit(e)}>
        <TextFieldContainer
          hasError={isTextOverflow}
          canSend={canSend}
          hasWarning={text.length >= MessageBody.MAX_MESSAGE_SIZE - 10}
        >
          <TextField
            contentEditable
            value={text}
            onChange={(e) => setText(e.target.value)}
            onInput={(e) => handleInput(e.currentTarget.textContent)}
            placeholder="メッセージを送信"
            role="textbox"
            spellCheck={false}
            type="text"
          />
          <Send onClick={() => handleSend()} />
        </TextFieldContainer>
      </MessageForm>
      <MainActionContainer>
        <ShowMessageLog />
        <DetailActions />
      </MainActionContainer>
      <ChatNotifications />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  align-items: center;
  box-sizing: border-box;
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, .1);
  display: flex;
  justify-content: center;
  padding: 8px;
  width: 100%;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    padding-bottom: 16px;
  }
`;

const ActionContainer = styled.div`
  display: flex;

  // モバイル版の場合隠す
  position: fixed;
  visibility: hidden;
  user-select: none;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    position: inherit;
    visibility: visible;
    user-select: inherit;
    margin: 0 8px;
    
    & > div {
      margin: 0 8px;
    }
  }
`;

const MainActionContainer = styled(ActionContainer)`

  position: inherit;
  visibility: visible;
  user-select: inherit;

  & > div:first-child {
    position: fixed;
    visibility: hidden;
    user-select: none;
  }

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    margin-left: 8px;

    & > div:first-child {
      position: inherit;
      visibility: visible;
      user-select: inherit;
    }
  }
`;

const MessageForm = styled.form`
  max-width: 500px;
  width: 100%;
  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    margin: 0 16px;
  }
`;

const TextFieldContainer = styled.div<{ hasError: boolean, hasWarning: boolean, canSend: boolean }>`
  align-items: center;
  background-color: white;
  box-sizing: border-box;
  border: ${({ hasError, hasWarning }) => {
    if (hasError) return 'red';
    if (hasWarning) return 'orange';
    return 'rgba(0, 0, 0, 0.2)';
  }} solid 1.5px;
  border-radius: 50px;
  display: flex;
  position: relative;
  width: 100%;
  padding: 0 8px;

  & > svg {
    color: ${({ canSend }) => (canSend ? '#5b87fa' : 'rgba(0,0,0,.5)')};
    cursor: pointer;
    fill: currentColor;
    width: ${({ canSend }) => (canSend ? 32 : 0)}px;
    padding: 8px;
  }

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    & > svg {
      width: 32px;
    } 
  }
`;

const TextField = styled.input`
  border: none;
  outline: none;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  -webkit-user-modify: read-write-plaintext-only;
  flex: 1;

  :empty:before {
    color: #72767d;
    content: attr(placeholder);
    pointer-events: none;
    display: block;
  }
`;
