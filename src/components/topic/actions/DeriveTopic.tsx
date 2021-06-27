import AddIcon from 'src/components/svgs/add.svg';
import React from 'react';
import { ChatAction } from 'src/components/topic/actions/ChatAction';

export const DeriveTopic = () => (
  <ChatAction
    onClick={() => {}}
    message="話題を広げる"
  >
    <AddIcon />
  </ChatAction>
);
