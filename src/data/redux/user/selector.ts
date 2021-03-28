import { useSelector } from 'react-redux';
import { RootState } from 'src/data/redux/state';

export const useUserSelector = () => useSelector((state: RootState) => state.user);
