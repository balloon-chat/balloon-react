import { TopicService } from 'src/domain/topic/service/topicService';
import { Subject } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Epic, ofType } from 'redux-observable';
import { RootState } from 'src/data/redux/state';
import { observeTopic, observeTopicFulfilled } from 'src/data/redux/chat/slice';
import { ObserveTopic, ObserveTopicFulfilled } from 'src/data/redux/chat/action';

let service: TopicService|null = null;
const unsubscribeSubjects: Subject<void>[] = [];

export const chatEpic: Epic<
  ObserveTopic,
  ObserveTopicFulfilled,
  RootState
> = (action$) => action$.pipe(
  ofType(observeTopic.type),
  mergeMap(({ payload }) => {
    service = service ?? new TopicService();

    unsubscribeSubjects.forEach((s) => {
      s.next();
      s.complete();
    });
    unsubscribeSubjects.splice(0);

    const unsubscribe = new Subject<void>();
    unsubscribeSubjects.push(unsubscribe);

    return service.observeTopic(payload.topicId, unsubscribe).pipe(
      map(
        (topic): ObserveTopicFulfilled => ({
          type: observeTopicFulfilled.type,
          payload: {
            topicId: payload.topicId,
            topic,
          },
        }),
      ),
    );
  }),
);
