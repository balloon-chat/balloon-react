import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { CreateTopic } from 'src/domain/topic/usecases/createTopic';
import { UserId } from 'src/domain/user/models/userId';
import { GetTopics } from 'src/domain/topic/usecases/getTopics';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { GetTopic } from 'src/domain/topic/usecases/getTopic';
import { TopicId } from 'src/domain/topic/models/topic/topicId';
import { TopicData } from 'src/domain/topic/models/topic/topicData';
import { ITopicImageRepository } from 'src/domain/topic/repository/topicImageRepository';
import { GetRecommendTopics } from 'src/domain/topic/usecases/getRecommendTopics';
import { IRecommendTopicRepository } from 'src/domain/topic/repository/recommendTopicRepository';
import { FirebaseRecommendTopicDatabase } from 'src/data/firebase/topic/recommendTopicDatabase';
import { FirebaseTopicDatabase } from 'src/data/firebase/topic/topicDatabase';
import { FirebaseTopicImageDatabase } from 'src/data/firebase/topic/topicImageDatabase';
import { FirebaseMessageDatabase } from 'src/data/firebase/message/messageDatabase';
import { FirebaseUserDatabase } from 'src/data/firebase/user/userDatabase';
import { IGetRecommendTopics } from 'src/domain/topic/types/getRecommendTopics';
import { ICreateTopic } from 'src/domain/topic/types/createTopic';
import { IGetTopics } from 'src/domain/topic/types/getTopics';
import { RecommendTopics } from 'src/domain/topic/models/recommend/recommendTopics';
import { IGetTopic } from 'src/domain/topic/types/getTopic';
import { IGetTopicsCreatedBy } from 'src/domain/topic/types/getTopicsCreatedBy';
import { GetTopicsCreatedBy } from 'src/domain/topic/usecases/getTopicsCreatedBy';
import { IInvitationRepository } from 'src/domain/topic/repository/invitationRepository';
import { InvitationApi } from 'src/data/api/topic/InvitationApi';
import { IGetTopicByInvitationCode } from 'src/domain/topic/types/getTopicByInvitationCode';
import { GetTopicByInvitationCode } from 'src/domain/topic/usecases/getTopicByInvitationCode';
import { IUpdateTopic } from 'src/domain/topic/types/updateTopic';
import { UpdateTopic } from 'src/domain/topic/usecases/updateTopic';
import { TopicEntity, TopicEntityFactory } from 'src/view/types/topic';
import { IDeriveTopic } from 'src/domain/topic/types/deriveTopic';
import { DeriveTopic } from 'src/domain/topic/usecases/deriveTopic';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IObserveTopic } from 'src/domain/topic/types/observeTopic';
import { ObserveTopic } from 'src/domain/topic/usecases/observeTopic';

export class TopicService {
  private readonly createTopicUsecase: ICreateTopic;

  private readonly deriveTopicUsecase: IDeriveTopic;

  private readonly getTopicUsecase: IGetTopic;

  private readonly getTopicByInvitationCodeUsecase: IGetTopicByInvitationCode;

  private readonly getTopicsUsecase: IGetTopics;

  private readonly getTopicsCreatedByUsecase: IGetTopicsCreatedBy;

  private readonly getRecommendTopicsUsecase: IGetRecommendTopics;

  private readonly observeTopicUsecase: IObserveTopic;

  private readonly updateTopicUsecase: IUpdateTopic;

  constructor(
    topicRepository: ITopicRepository
    = FirebaseTopicDatabase.instance,
    recommendTopicRepository: IRecommendTopicRepository
    = FirebaseRecommendTopicDatabase.instance,
    topicImageRepository: ITopicImageRepository
    = FirebaseTopicImageDatabase.instance,
    messageRepository: IMessageRepository
    = FirebaseMessageDatabase.instance,
    userRepository: IUserRepository
    = FirebaseUserDatabase.instance,
    private readonly invitationRepository: IInvitationRepository
    = new InvitationApi(),
  ) {
    this.createTopicUsecase = new CreateTopic(
      topicRepository,
      topicImageRepository,
      userRepository,
      invitationRepository,
    );
    this.deriveTopicUsecase = new DeriveTopic(
      topicRepository,
    );
    this.getTopicUsecase = new GetTopic(
      messageRepository,
      topicRepository,
      userRepository,
    );
    this.getTopicByInvitationCodeUsecase = new GetTopicByInvitationCode(
      invitationRepository,
      this.getTopicUsecase,
    );
    this.getTopicsUsecase = new GetTopics(
      topicRepository,
      messageRepository,
      userRepository,
    );
    this.getTopicsCreatedByUsecase = new GetTopicsCreatedBy(
      topicRepository,
      messageRepository,
      userRepository,
    );
    this.getRecommendTopicsUsecase = new GetRecommendTopics(
      this.getTopicsUsecase,
      recommendTopicRepository,
    );
    this.observeTopicUsecase = new ObserveTopic(
      topicRepository,
    );
    this.updateTopicUsecase = new UpdateTopic(
      topicRepository,
      topicImageRepository,
    );
  }

  async createTopic(
    title: string,
    description: string,
    createdBy: string,
    thumbnail: File | Blob,
    isPrivate: boolean,
  ): Promise<TopicEntity> {
    const topic = await this.createTopicUsecase.execute(
      title,
      description,
      new UserId(createdBy),
      thumbnail,
      isPrivate,
    );

    return TopicEntityFactory.fromTopic({
      topic,
      commentCount: 0,
    });
  }

  async deriveTopic(topicId: string, title: string): Promise<TopicEntity|undefined> {
    await this.deriveTopicUsecase.execute(topicId, title);
    return this.getTopic(topicId);
  }

  async getTopic(topicId: string): Promise<TopicEntity|undefined> {
    const topicData = await this.getTopicUsecase.execute(new TopicId(topicId));
    if (!topicData) return undefined;

    return TopicEntityFactory.create(topicData);
  }

  async updateTopic(topicId: string, params: {
    title?: string,
    description?: string,
    thumbnail?: File|Blob,
    isPrivate?: boolean,
  }): Promise<TopicEntity> {
    const topic = await this.updateTopicUsecase.execute(topicId, params);
    return TopicEntityFactory.fromTopic({
      topic,
      commentCount: 0,
    });
  }

  fetchTopic(topicId: string): Promise<TopicData | undefined> {
    return this.getTopicUsecase.execute(new TopicId(topicId));
  }

  async fetchTopicFromCode(code: number[] | string): Promise<TopicData | undefined> {
    return this.getTopicByInvitationCodeUsecase.execute(code);
  }

  async fetchTopics(limit: number, from?: string): Promise<TopicEntity[]> {
    const data = await this.getTopicsUsecase.execute(
      limit,
      from ? new TopicId(from) : undefined,
    );
    return data.map((d) => TopicEntityFactory.create(d));
  }

  /**
   * @param createdBy 作成者のID
   * @param loginId 閲覧者のログインID
   */
  fetchTopicsCreatedBy(createdBy: string, loginId?: string): Promise<TopicData[]> {
    return this.getTopicsCreatedByUsecase.execute(createdBy, loginId);
  }

  fetchRecommendTopics(): Promise<RecommendTopics | undefined> {
    return this.getRecommendTopicsUsecase.execute();
  }

  async fetchInvitationCode(topicId: string): Promise<number[] | null> {
    try {
      const code = await this.invitationRepository
        .findInvitationCodeByTopicId(new TopicId(topicId));
      return code?.code ?? null;
    } catch (e) {
      return null;
    }
  }

  observeTopic(topicId: string, unsubscribe: Subject<void>): Observable<TopicEntity| null> {
    return this.observeTopicUsecase.execute(topicId, unsubscribe)
      .pipe(
        map((topic) => {
          if (!topic) return null;
          return TopicEntityFactory.fromTopic({
            topic,
            commentCount: 0,
          });
        }),
      );
  }
}
