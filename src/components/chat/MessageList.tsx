import { useMessageState } from 'src/data/redux/message/selector';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { observeStart } from 'src/data/redux/message/slice';
import { useTopicState } from 'src/data/redux/topic/selector';
import { Message } from 'src/components/chat/Message';
import styled from 'styled-components';

// tslint:disable-next-line:variable-name
export const MessageList = () => {
  const { messages } = useMessageState();
  const { topicId } = useTopicState();
  const dispatcher = useDispatch();

  useEffect(() => {
    if (topicId) dispatcher(observeStart({ topicId }));
  },        [topicId]);

  return (<ChatContainer>{
    messages.map((message, index) => (<Message key={index} {...message}/>))
  }</ChatContainer>);
};

// tslint:disable-next-line:variable-name
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  background-color: #FDFDFD;
  overflow-y: scroll;

  & > div {
    margin-bottom: 16px;
  }
`;
