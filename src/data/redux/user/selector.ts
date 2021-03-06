import { useSelector } from 'react-redux';
import { RootState } from 'src/data/redux/state';

export const useUserSelector = () => {
  return useSelector((state: RootState) => state.user);
};
