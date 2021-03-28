import styled from 'styled-components';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendMessage as sendMessageAction } from 'src/data/redux/message/action';
import { useTopicState } from 'src/data/redux/topic/selector';
import { useUserSelector } from 'src/data/redux/user/selector';

export const MessageField = () => {
  const dispatcher = useDispatch();

  const [text, setText] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const { topicId } = useTopicState();
  const userId = useUserSelector().uid;

  const handleInput = (value: string | null) => {
    if (value) setText(value);
    setIsVisible(value === '' || value === null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 改行をさせない
      e.currentTarget.textContent = ''; // 入力内容をクリア
      sendMessage(text);
    }
  };

  const sendMessage = (message: string) => {
    if (topicId && userId) dispatcher(sendMessageAction({ message, userId, topicId }));
  };

  return (
    <MessageForm>
      <TextFieldContainer>
        {isVisible && <Placeholder aria-hidden>メッセージを送信</Placeholder>}
        <TextField
          contentEditable
          onInput={(e) => handleInput(e.currentTarget.textContent)}
          onKeyPress={handleKeyPress}
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
  margin-bottom: 24px;
  position: relative;
  width: 100%;
`;

const TextFieldCommon = styled.div`
  padding: 8px;
`;

const TextField = styled(TextFieldCommon)`
  outline: none;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  -webkit-user-modify: read-write-plaintext-only;
`;

const Placeholder = styled(TextFieldCommon)`
  color: #72767d;
  left: 0;
  overflow: hidden;
  right: 0;
  text-overflow: ellipsis;
  position: absolute;
  white-space: nowrap;
  user-select: none;
  pointer-events: none;
`;
