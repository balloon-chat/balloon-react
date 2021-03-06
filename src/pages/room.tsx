import React from 'react';
import { MessageField } from 'src/components/chat/MessageField';
import { Chat } from 'src/components/chat/Chat';

// tslint:disable-next-line:variable-name
const RoomPage = () => {
  return (<div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyItems: 'stretch' }}>
    <Chat/>
    <MessageField/>
  </div>);
};

export default RoomPage;
