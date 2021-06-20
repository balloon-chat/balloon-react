import styled from 'styled-components';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendMessage as sendMessageAction } from 'src/data/redux/message/action';
import { useTopicState } from 'src/data/redux/topic/selector';
import { useUserSelector } from 'src/data/redux/user/selector';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import { ReactComponent as Send } from 'src/components/svgs/send.svg';
import { ChatMenu } from 'src/components/chat/ChatMenu';
import { CommentListMenu } from 'src/components/topic/commetns/CommentListMenu';

export const MessageField = () => {
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
      <CommentListMenu />
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
      <ChatMenu />
    </Container>
  );
};

const Container = styled.div`
  align-items: center;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: center;
  padding: 0 8px 16px 8px;
  width: 100%;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    padding-bottom: 24px;
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
