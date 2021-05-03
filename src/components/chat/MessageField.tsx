import styled from 'styled-components';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendMessage as sendMessageAction } from 'src/data/redux/message/action';
import { useTopicState } from 'src/data/redux/topic/selector';
import { useUserSelector } from 'src/data/redux/user/selector';
import { mediaQuery } from 'src/components/constants/mediaQuery';

export const MessageField = () => {
  const dispatcher = useDispatch();
  const { topicId } = useTopicState();
  const { uid } = useUserSelector();
  const [text, setText] = useState('');

  const handleInput = (value: string | null) => {
    if (value) setText(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 改行をさせない
      e.currentTarget.textContent = null; // 入力内容をクリア
      sendMessage(text);
    }
  };

  const sendMessage = (message: string) => {
    if (topicId && uid) dispatcher(sendMessageAction({ message, userId: uid, topicId }));
  };

  return (
    <MessageForm>
      <TextFieldContainer>
        <TextField
          contentEditable
          onInput={(e) => handleInput(e.currentTarget.textContent)}
          onKeyPress={handleKeyPress}
          placeholder="メッセージを送信"
          role="textbox"
        />
      </TextFieldContainer>
    </MessageForm>
  );
};

const MessageForm = styled.form`
  box-sizing: border-box;
  display: flex;
  padding: 0 16px;
  width: 100%;
`;

const TextFieldContainer = styled.div`
  background-color: white;
  border: rgba(0, 0, 0, 0.2) solid 1px;
  border-radius: 8px;
  box-shadow: black;
  margin-bottom: 16px;
  position: relative;
  width: 100%;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    margin-bottom: 24px;
  }
`;

const TextField = styled.div`
  outline: none;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  -webkit-user-modify: read-write-plaintext-only;
  padding: 8px;
  
  :empty:before {
    color: #72767d;
    content: attr(placeholder);
    pointer-events: none;
    display: block;
  }
`;
