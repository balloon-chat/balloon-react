import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { TopicRepository } from 'src/data/core/topic/topicRepository';
import { CreateTopic, ICreateTopic } from 'src/domain/topic/usecases/createTopic';
import { Topic } from 'src/domain/topic/models/topic';
import { UserId } from 'src/domain/user/models/userId';
import { FirebaseTopicDatabase } from 'src/data/firebase/topic/topicDatabase';
import { GetTopics, IGetTopics } from 'src/domain/topic/usecases/getTopics';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { MessageRepository } from 'src/data/core/message/messageRepository';
import { FirebaseMessageDatabase } from 'src/data/firebase/message/messageDatabase';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { UserRepository } from 'src/data/core/user/userRepository';
import { GetTopic, IGetTopic } from 'src/domain/topic/usecases/getTopic';
import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicData } from 'src/domain/topic/usecases/types';
import { FirebaseUserDatabase } from 'src/data/firebase/user/userDatabase';
import { ITopicImageRepository } from 'src/domain/topic/repository/topicImageRepository';
import { TopicImageRepository } from 'src/data/core/topic/topicImageRepository';
import { FirebaseTopicImageDatabase } from 'src/data/firebase/topic/topicImageDatabase';

export class TopicService {
  private readonly createTopicUsecase: ICreateTopic;
  private readonly getTopicsUsecase: IGetTopics;
  private readonly getTopicUsecase: IGetTopic;

  constructor(
      topicRepository: ITopicRepository = new TopicRepository(FirebaseTopicDatabase.instance),
      topicImageRepository: ITopicImageRepository = new TopicImageRepository(FirebaseTopicImageDatabase.instance),
      messageRepository: IMessageRepository = new MessageRepository(FirebaseMessageDatabase.instance),
      userRepository: IUserRepository = new UserRepository(FirebaseUserDatabase.instance),
  ) {
    this.createTopicUsecase = new CreateTopic(topicRepository, topicImageRepository, userRepository);
    this.getTopicsUsecase = new GetTopics(messageRepository, topicRepository, userRepository);
    this.getTopicUsecase = new GetTopic(messageRepository, topicRepository, userRepository);
  }

  createTopic(title: string, description: string, createdBy: string, thumbnail: File | Blob): Promise<Topic> {
    return this.createTopicUsecase.execute(title, description, new UserId(createdBy), thumbnail);
  }

  fetchTopic(topicId: string): Promise<TopicData | undefined> {
    return this.getTopicUsecase.execute(new TopicId(topicId));
  }

  fetchTopics(limit: number): Promise<TopicData[]> {
    return this.getTopicsUsecase.execute(limit);
  }
}
