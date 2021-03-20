import { Epic, ofType } from 'redux-observable';
import { ObserveFulfilled, ObserveStart } from 'src/data/redux/message/action';
import { map, mergeMap } from 'rxjs/operators';
import { observeFulfilled, observeStart } from 'src/data/redux/message/slice';
import { RootState } from 'src/data/redux/state';
import { MessageService } from 'src/domain/message/service/MessageService';

export const messageEpic: Epic<ObserveStart, ObserveFulfilled, RootState> = (action$) => action$.pipe(
    ofType(observeStart.type),
    mergeMap(({ payload }) => {
      const service = new MessageService();
      return service.observeMessageData(payload.topicId).pipe(
              map((messages): ObserveFulfilled => ({
                type: observeFulfilled.type,
                payload: {
                  topicId: payload.topicId,
                  messages,
                },
              } as const)),
          );
    }),
);
