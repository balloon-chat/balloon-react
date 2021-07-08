import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { messageEpic } from 'src/data/redux/message/epic';
import { MessageActions } from 'src/data/redux/message/action';
import { RootState } from 'src/data/redux/state';
import { chatEpic } from 'src/data/redux/chat/epic';
import { ChatActions } from 'src/data/redux/chat/action';

type Actions = ChatActions|MessageActions;
export const rootEpic = combineEpics(chatEpic, messageEpic);
export const epicMiddleware = createEpicMiddleware<
  Actions,
  Actions,
  RootState
>();
