import { Epic, ofType } from 'redux-observable';
import { ObserveFulfilled, ObserveStart } from 'src/data/redux/message/action';
import { map, mergeMap } from 'rxjs/operators';
import { observeFulfilled, observeStart } from 'src/data/redux/message/slice';
import { RootState } from 'src/data/redux/state';
import { MessageService } from 'src/domain/message/service/MessageService';
import { Subject } from 'rxjs';

let service: MessageService|null = null;
const unsubscribeSubjects: Subject<void>[] = [];

export const messageEpic: Epic<ObserveStart, ObserveFulfilled, RootState> = (
  action$,
) => action$.pipe(
  ofType(observeStart.type),
  mergeMap(({ payload }) => {
    service = service ?? new MessageService();

    // 前回までのサブスクリプションをすべてキャンセルする。
    unsubscribeSubjects.forEach((s) => {
      s.next();
      s.complete();
    });
    unsubscribeSubjects.splice(0);

    const unsubscribe = new Subject<void>();
    unsubscribeSubjects.push(unsubscribe);

    return service.observeMessageData(payload.topicId, unsubscribe).pipe(
      map(
        (messages): ObserveFulfilled => ({
          type: observeFulfilled.type,
          payload: {
            topicId: payload.topicId,
            messages,
          },
        } as const),
      ),
    );
  }),
);
