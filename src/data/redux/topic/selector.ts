import { useSelector } from 'react-redux';
import { RootState } from 'src/data/redux/state';

export const useTopicState = () => {
  return useSelector((state: RootState) => state.topic);
};
