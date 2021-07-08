import { IGetTopicsCreatedBy } from 'src/domain/topic/types/getTopicsCreatedBy';
import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { UserId } from 'src/domain/user/models/userId';
import { TopicData } from 'src/domain/topic/models/topicData';
import { IGetTopic } from 'src/domain/topic/types/getTopic';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { GetTopic } from 'src/domain/topic/usecases/getTopic';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';

export class GetTopicsCreatedBy implements IGetTopicsCreatedBy {
  private readonly getTopicUseCase: IGetTopic;

  constructor(
    private readonly topicRepository: ITopicRepository,
    messageRepository: IMessageRepository,
    private readonly userRepository: IUserRepository,
  ) {
    this.getTopicUseCase = new GetTopic(
      messageRepository,
      this.topicRepository,
      this.userRepository,
    );
  }

  async execute(createdBy: string, loginId?: string): Promise<TopicData[]> {
    let isSameUser = false;
    if (loginId) {
      const currentUser = await this.userRepository.findByLoginId(loginId);
      isSameUser = createdBy === currentUser?.id.value;
    }

    // 閲覧者と作成者が同じだった場合のみ、非公開のTopicも取得する
    const entities = isSameUser
      ? await this.topicRepository.findAllTopicsCreatedBy(new UserId(createdBy))
      : await this.topicRepository.findAllPublicTopicsCreatedBy(new UserId(createdBy));

    const topicIds = entities.map((entity) => entity.id);
    const results: (TopicData | undefined)[] = await Promise.all(
      topicIds.map((topicId) => this.getTopicUseCase.execute(topicId)),
    );

    const topics = results.filter<TopicData>((result): result is TopicData => result !== undefined);
    const sortedByCreatedAt = topics.sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());
    return sortedByCreatedAt;
  }
}
