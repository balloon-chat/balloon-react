import styled from 'styled-components';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendMessage as sendMessageAction } from 'src/data/redux/message/action';
import { useTopicState } from 'src/data/redux/topic/selector';
import { useUserSelector } from 'src/data/redux/user/selector';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import { ReactComponent as Send } from 'src/components/svgs/send.svg';
import { ShowMessageLog } from 'src/components/topic/actions/ShowMessageLog';
import { DeriveTopic } from 'src/components/topic/actions/DeriveTopic';
import { DetailActions } from 'src/components/topic/actions/DetailActions';

export const ChatForm = () => {
  const dispatcher = useDispatch();
  const { currentTopic } = useTopicState();
  const { uid } = useUserSelector();
  const [text, setText] = useState('');

  const handleInput = (value: string | null) => {
    if (value) setText(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text) sendMessage(text);
  };

  const handleSend = () => {
    if (text) sendMessage(text);
  };

  const sendMessage = (message: string) => {
    if (currentTopic && uid && message) {
      dispatcher(sendMessageAction({
        message,
        userId: uid,
        topicId: currentTopic.id,
      }));
    }
    setText('');
  };

  return (
    <Container>
      <ActionContainer>
        <DeriveTopic />
        <ShowMessageLog />
      </ActionContainer>
      <MessageForm onSubmit={(e) => handleSubmit(e)}>
        <TextFieldContainer>
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
        <DetailActions />
      </MainActionContainer>
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

const MainActionContainer = styled.div`
  margin-left: 8px;
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

const MessageForm = styled.form`
  max-width: 500px;
  width: 100%;
  margin: 0 8px;
  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    margin: 0 16px;
  }
`;

const TextFieldContainer = styled.div`
  align-items: center;
  background-color: white;
  box-sizing: border-box;
  border: rgba(0, 0, 0, 0.2) solid 1px;
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
