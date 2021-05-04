import styled from 'styled-components';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendMessage as sendMessageAction } from 'src/data/redux/message/action';
import { useTopicState } from 'src/data/redux/topic/selector';
import { useUserSelector } from 'src/data/redux/user/selector';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import { ReactComponent as Send } from 'src/components/svgs/send.svg';

export const MessageField = () => {
  const dispatcher = useDispatch();
  const { topicId } = useTopicState();
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
    if (topicId && uid && message) dispatcher(sendMessageAction({ message, userId: uid, topicId }));
    setText('');
  };

  return (
    <MessageForm onSubmit={(e) => handleSubmit(e)}>
      <TextFieldContainer>
        <TextField
          contentEditable
          value={text}
          onChange={(e) => setText(e.target.value)}
          onInput={(e) => handleInput(e.currentTarget.textContent)}
          placeholder="メッセージを送信"
          role="textbox"
        />
        <Send onClick={() => handleSend()} />
      </TextFieldContainer>
    </MessageForm>
  );
};

const MessageForm = styled.form`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  padding: 0 16px;
  width: 100%;
`;

const TextFieldContainer = styled.div`
  align-items: center;
  background-color: white;
  box-sizing: border-box;
  border: rgba(0, 0, 0, 0.2) solid 1px;
  border-radius: 50px;
  box-shadow: black;
  display: flex;
  margin-bottom: 16px;
  position: relative;
  flex-wrap: wrap;
  max-width: 500px;
  width: 100%;
  padding: 0 8px;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    margin-bottom: 24px;
  }
  
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
