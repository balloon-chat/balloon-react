import { useSelector } from 'react-redux';
import { RootState } from 'src/data/redux/state';

export const useRoomState = () => {
  return useSelector((state: RootState) => state.room);
};
