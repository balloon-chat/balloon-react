import { useSelector } from 'react-redux';
import { ChatState } from 'src/data/redux/chat/state';

export const useChatState = () => useSelector(
  (state: { chat: ChatState }) => state.chat,
);
