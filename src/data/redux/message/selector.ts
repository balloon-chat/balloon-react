import { useSelector } from 'react-redux';
import { MessageState } from 'src/data/redux/message/state';

export const useMessageState = () => useSelector(
  (state: { message: MessageState }) => state.message,
);
