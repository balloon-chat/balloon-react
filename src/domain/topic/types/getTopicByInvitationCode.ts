import { TopicData } from 'src/domain/topic/models/topicData';

export interface IGetTopicByInvitationCode {
  execute(code: number[] | string): Promise<TopicData | undefined>
}
