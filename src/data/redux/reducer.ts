import { combineReducers } from 'redux';
import { messageReducer } from 'src/data/redux/message/slice';
import { roomReducer } from 'src/data/redux/room/slice';
import { userReducer } from 'src/data/redux/user/slice';

export default combineReducers({
  message: messageReducer,
  room: roomReducer,
  user: userReducer,
});
