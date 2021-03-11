import { combineReducers } from 'redux';
import { messageReducer } from 'src/data/redux/message/slice';
import { topicReducer } from 'src/data/redux/topic/slice';
import { userReducer } from 'src/data/redux/user/slice';

export default combineReducers({
  message: messageReducer,
  topic: topicReducer,
  user: userReducer,
});
