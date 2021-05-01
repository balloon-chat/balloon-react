import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { CreateTopic } from 'src/domain/topic/usecases/createTopic';
import { Topic } from 'src/domain/topic/models/topic';
import { UserId } from 'src/domain/user/models/userId';
import { GetTopics } from 'src/domain/topic/usecases/getTopics';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { GetTopic } from 'src/domain/topic/usecases/getTopic';
import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicData } from 'src/domain/topic/models/topicData';
import { ITopicImageRepository } from 'src/domain/topic/repository/topicImageRepository';
import { GetRecommendTopics } from 'src/domain/topic/usecases/getRecommendTopics';
import { IRecommendTopicRepository } from 'src/domain/topic/repository/recommendTopicRepository';
import { RecommendTopicRepository } from 'src/data/core/topic/recommendTopicRepository';
import { FirebaseRecommendTopicDatabase } from 'src/data/firebase/topic/recommendTopicDatabase';
import { FirebaseTopicDatabase } from 'src/data/firebase/topic/topicDatabase';
import { FirebaseTopicImageDatabase } from 'src/data/firebase/topic/topicImageDatabase';
import { FirebaseMessageDatabase } from 'src/data/firebase/message/messageDatabase';
import { FirebaseUserDatabase } from 'src/data/firebase/user/userDatabase';
import { UserRepository } from 'src/data/core/user/userRepository';
import { MessageRepository } from 'src/data/core/message/messageRepository';
import { TopicImageRepository } from 'src/data/core/topic/topicImageRepository';
import { TopicRepository } from 'src/data/core/topic/topicRepository';
import { IGetRecommendTopics } from 'src/domain/topic/types/getRecommendTopics';
import { ICreateTopic } from 'src/domain/topic/types/createTopic';
import { IGetTopics } from 'src/domain/topic/types/getTopics';
import { RecommendTopics } from 'src/domain/topic/models/recommendTopics';
import { IGetTopic } from 'src/domain/topic/types/getTopic';
import { IGetTopicsCreatedBy } from 'src/domain/topic/types/getTopicsCreatedBy';
import { GetTopicsCreatedBy } from 'src/domain/topic/usecases/getTopicsCreatedBy';
import { IInvitationRepository } from 'src/domain/topic/repository/invitationRepository';
import { InvitationApi } from 'src/data/api/topic/InvitationApi';
import { IGetTopicByInvitationCode } from 'src/domain/topic/types/getTopicByInvitationCode';
import { GetTopicByInvitationCode } from 'src/domain/topic/usecases/getTopicByInvitationCode';

export class TopicService {
  private readonly createTopicUsecase: ICreateTopic;

  private readonly getTopicUsecase: IGetTopic;

  private readonly getTopicByInvitationCodeUsecase: IGetTopicByInvitationCode;

  private readonly getTopicsUsecase: IGetTopics;

  private readonly getTopicsCreatedByUsecase: IGetTopicsCreatedBy;

  private readonly getRecommendTopicsUsecase: IGetRecommendTopics;

  constructor(
    topicRepository: ITopicRepository
    = new TopicRepository(FirebaseTopicDatabase.instance),
    recommendTopicRepository: IRecommendTopicRepository
    = new RecommendTopicRepository(FirebaseRecommendTopicDatabase.instance),
    topicImageRepository: ITopicImageRepository
    = new TopicImageRepository(FirebaseTopicImageDatabase.instance),
    messageRepository: IMessageRepository
    = new MessageRepository(FirebaseMessageDatabase.instance),
    userRepository: IUserRepository
    = new UserRepository(FirebaseUserDatabase.instance),
    private readonly invitationRepository: IInvitationRepository
    = new InvitationApi(),
  ) {
    this.createTopicUsecase = new CreateTopic(
      topicRepository,
      topicImageRepository,
      userRepository,
      invitationRepository,
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
      messageRepository,
      topicRepository,
      userRepository,
    );
    this.getTopicsCreatedByUsecase = new GetTopicsCreatedBy(
      topicRepository,
      userRepository,
      this.getTopicUsecase,
    );
    this.getRecommendTopicsUsecase = new GetRecommendTopics(
      this.getTopicsUsecase,
      recommendTopicRepository,
    );
  }

  createTopic(
    title: string,
    description: string,
    createdBy: string,
    thumbnail: File | Blob,
    isPrivate: boolean,
  ): Promise<Topic> {
    return this.createTopicUsecase.execute(
      title,
      description,
      new UserId(createdBy),
      thumbnail,
      isPrivate,
    );
  }

  fetchTopic(topicId: string): Promise<TopicData | undefined> {
    return this.getTopicUsecase.execute(new TopicId(topicId));
  }

  async fetchTopicFromCode(code: number[] | string): Promise<TopicData | undefined> {
    return this.getTopicByInvitationCodeUsecase.execute(code);
  }

  fetchTopics(limit: number, from?: string): Promise<TopicData[]> {
    return this.getTopicsUsecase.execute(
      limit,
      from ? new TopicId(from) : undefined,
    );
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
}
