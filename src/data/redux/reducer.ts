import { combineReducers } from 'redux';
import { messageReducer } from 'src/data/redux/message/slice';

export default combineReducers({
  message: messageReducer,
});
