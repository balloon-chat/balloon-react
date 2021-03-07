import styled from 'styled-components';
import React, { CSSProperties, useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendMessage as sendMessageAction } from 'src/data/redux/message/action';
import { useRoomState } from 'src/data/redux/room/selector';
import { useUserSelector } from 'src/data/redux/user/selector';

// tslint:disable-next-line:variable-name
export const MessageField = () => {

  const dispatcher = useDispatch();

  const [text, setText] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const roomId = useRoomState().roomId;
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
    if (roomId && userId) dispatcher(sendMessageAction({ message, userId, roomId }));
  };

  return (<MessageFieldContainer>
    <MessageTextArea>
      {isVisible && <Placeholder style={textFieldStyle} aria-hidden={true}>メッセージを送信</Placeholder>}
      <TextField
          style={textFieldStyle}
          contentEditable={true}
          onInput={(e) => handleInput(e.currentTarget.textContent)}
          onKeyPress={handleKeyPress}
          role={'text'}
          />
    </MessageTextArea>
  </MessageFieldContainer>);
};

// tslint:disable-next-line:variable-name
const MessageFieldContainer = styled.form`
  box-sizing: border-box;
  display: flex;
  padding: 0 16px;
  width: 100%;
`;

// テキストフィールドと、プレースホルダーのスタイルを一致させる
const textFieldStyle: CSSProperties = {
  padding: 8,
};

// tslint:disable-next-line:variable-name
const MessageTextArea = styled.div`
  background-color: white;
  border: rgba(0, 0, 0, .2) solid 1px;
  border-radius: 8px;
  box-shadow: black;
  margin-bottom: 24px;
  position: relative;
  width: 100%;
`;

// tslint:disable-next-line:variable-name
const TextField = styled.div`
  outline: none;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  -webkit-user-modify: read-write-plaintext-only;
`;

// tslint:disable-next-line:variable-name
const Placeholder = styled.div`
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
