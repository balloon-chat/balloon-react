import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import reducer from 'src/data/redux/reducer';
import { epicMiddleware, rootEpic } from 'src/data/redux/epic';

export const store = configureStore({
  reducer,
  middleware: [
    epicMiddleware,
    ...getDefaultMiddleware({
      serializableCheck: false,
      thunk: true,
    }),
  ],
  // TODO: show only development
  // devTools: process.env.NODE_ENV === 'development',
  devTools: true,
});

epicMiddleware.run(rootEpic);
