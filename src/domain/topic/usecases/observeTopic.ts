import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IObserveTopic } from 'src/domain/topic/types/observeTopic';
import { Topic } from 'src/domain/topic/models/topic';
import { TopicId } from 'src/domain/topic/models/topicId';
import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';

export class ObserveTopic implements IObserveTopic {
  constructor(private readonly topicRepository: ITopicRepository) {
  }

  execute(
    topicId: string,
    unsubscribe?: Subject<void>,
  ): Observable<Topic | null> {
    return this.topicRepository.observeTopic(new TopicId(topicId), unsubscribe)
      .pipe(
        map((entity) => {
          if (!entity) return null;
          return entity.toTopic();
        }),
      );
  }
}
