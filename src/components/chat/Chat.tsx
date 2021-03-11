import styled from 'styled-components';
import { useMessageState } from 'src/data/redux/message/selector';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { observeStart } from 'src/data/redux/message/slice';
import { useTopicState } from 'src/data/redux/topic/selector';

// tslint:disable-next-line:variable-name
export const Chat = () => {
  const messages = useMessageState().messages;
  const topicId = useTopicState().topicId;

  const dispatcher = useDispatch();

  useEffect(() => {
    if (topicId) dispatcher(observeStart({ topicId }));
  },        [topicId]);

  return (<ChatContainer>{
    messages.map((message, index) => (
        <div key={index}>
          <p style={{ marginBottom: 0 }}>{message.message}</p>
          <p style={{ color: 'rgba(0,0,0,.5)', marginTop: 0 }}>
            [id] {message.id} [sender] {message.sender} [at] {message.createdAt}
          </p>
        </div>
    ))
  }</ChatContainer>);
};

// tslint:disable-next-line:variable-name
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  background-color: #FDFDFD;
`;
