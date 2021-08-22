import styled, { keyframes } from 'styled-components';
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
import { notify } from 'src/data/redux/chat/slice';
import { ChatNotificationTypes } from 'src/data/redux/chat/state';
import { Transition } from 'react-transition-group';

export const ChatForm = () => {
  const dispatcher = useDispatch();
  const { topicId, branchTopicId } = useChatState();
  const { uid } = useUserSelector();
  const [text, setText] = useState('');
  const [isTextOverflow, setIsTextOverflow] = useState(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    setIsTextOverflow(text.length > MessageBody.MAX_MESSAGE_SIZE);
  }, [text]);

  useEffect(() => {
    if (isTextOverflow) {
      dispatcher(notify({
        type: ChatNotificationTypes.SIMPLE_MESSAGE,
        title: null,
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
      <MessageForm onSubmit={(e) => handleSubmit(e)}>
        <TextFieldContainer
          hasError={isTextOverflow}
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
      <Transition in={isVisible} timeout={duration} unmountOnExit mountOnEnter>
        {
          (status) => {
            const visibleState = status === 'entering' || status === 'entered';
            return (
              <NotificationContainer>
                <Notification isVisible={visibleState} duration={duration}>
                  <Message>
                    <Icon src="" alt="" />
                    <p>友達を招待しましょう!</p>
                  </Message>
                  <Buttons>
                    <InvitationButton href="https://www.google.com/">招待をコピー</InvitationButton>
                    <CloseButton onClick={() => setIsVisible((isVisible) => !isVisible)}>
                      閉じる
                    </CloseButton>
                  </Buttons>
                </Notification>
              </NotificationContainer>
            );
          }
        }
      </Transition>
    </Container>
  );
};

const Container = styled.div`
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
  margin: 0 8px;
  & > div {
    margin: 0 8px;
  }

  // モバイル版の場合隠す
  position: fixed;
  visibility: hidden;
  user-select: none;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    position: inherit;
    visibility: visible;
    user-select: inherit;
  }
`;

const MainActionContainer = styled(ActionContainer)`
  margin-left: 8px;

  position: inherit;
  visibility: visible;
  user-select: inherit;

  & > div:first-child {
    position: fixed;
    visibility: hidden;
    user-select: none;
  }

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
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
  margin: 0 8px;
  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    margin: 0 16px;
  }
`;

const TextFieldContainer = styled.div<{ hasError: boolean, hasWarning: boolean }>`
  align-items: center;
  background-color: white;
  box-sizing: border-box;
  border: ${({ hasError, hasWarning }) => {
    if (hasError) return 'red';
    if (hasWarning) return 'orange';
    return 'rgba(0, 0, 0, 0.2)';
  }} solid 1.5px;
  border-radius: 50px;
  box-shadow: 0 10px 40px -10px rgb(0 64 128 / 20%);
  display: flex;
  position: relative;
  flex-wrap: wrap;
  width: 100%;
  padding: 0 8px;

  & > svg {
    color: #5b87fa;
    cursor: pointer;
    fill: currentColor;
    width: 32px;
    padding: 8px;
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

//------------
const duration = 600;

const NotificationContainer = styled.div`
  position: absolute;
  right: 16px;
  top: -108px;
  display: flex;
  justify-content: flex-end;
  overflow-x: hidden;
`;

const fadeinAnimation = keyframes`
  from { opacity: 0; }
  to   { opacity: 1.0; }
`;

const slideX = (from: number, to: number) => keyframes`
  from { transform: translateX(${from}px); }
  to   { transform: translateX(${to}px); }
`;

const Notification = styled.div<{ isVisible: boolean, duration: number }>`
  opacity: ${({ isVisible }) => (isVisible ? 1.0 : 0)};
  display: flex;
  transition: all ${({ duration }) => duration}ms;
  transform: translateX(${({ isVisible }) => (isVisible ? '0px' : '500px')});
  animation: ${fadeinAnimation} ${({ duration }) => duration}ms, ${slideX(500, 0)} ${({ duration }) => duration}ms;

  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  width: 300px;
  padding: 16px;
  flex-direction: column;
  background-color: white;
  p {
    margin: 0;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const CloseButton = styled.div`
  color: #158cbb;
  font-weight: 2px;
  padding: 5px;
  margin-top: 8px;
  cursor: pointer;

  :hover {
    opacity: 0.3;
    transition: 0.2s;
  }
`;

const InvitationButton = styled.a`
  color: white;
  font-weight: 2px;
  text-decoration: none;
  background-color: #158cbb;
  border-radius: 4px;
  padding: 5px 10px;
  margin-top: 8px;

  :hover {
    opacity: 0.3;
    transition: 0.2s;
  }
`;

const Message = styled.div`
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Icon = styled.img`
  width: 25px;
  padding: 0 5px;
`;
//------------
