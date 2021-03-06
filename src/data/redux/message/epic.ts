import { Epic, ofType } from 'redux-observable';
import { ObserveFulfilled, ObserveStart } from 'src/data/redux/message/actions';
import { map, mergeMap } from 'rxjs/operators';
import { MessageEntity } from 'src/domain/message/repository/messageEntity';
import { observeFulfilled, observeStart, ReduxMessageEntity } from 'src/data/redux/message/slice';
import { RootState } from 'src/data/redux/state';
import { MessageService } from 'src/domain/message/service/MessageService';

const service = new MessageService();

export const messageEpic: Epic<ObserveStart, ObserveFulfilled, RootState> = (action$, state) => action$.pipe(
    ofType(observeStart.type),
    mergeMap(() =>
        service.observeMessageData(state.value.message.roomId).pipe(
            map((messages): ObserveFulfilled => ({
              type: observeFulfilled.type,
              payload: {
                messages: messages.map((message: MessageEntity): ReduxMessageEntity => ({
                  id: message.id.value,
                  message: message.body.value,
                  sender: message.senderId.value,
                  createdAt: message.createdAt,
                } as const)),
              },
            }),
            ),
        )),
);
