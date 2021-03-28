import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { messageEpic } from 'src/data/redux/message/epic';
import { MessageActions } from 'src/data/redux/message/action';
import { RootState } from 'src/data/redux/state';

type Actions = MessageActions;
export const rootEpic = combineEpics(messageEpic);
export const epicMiddleware = createEpicMiddleware<
  Actions,
  Actions,
  RootState
>();
