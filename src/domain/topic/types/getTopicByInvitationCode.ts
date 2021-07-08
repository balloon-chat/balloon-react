import { TopicData } from 'src/domain/topic/models/topic/topicData';

export interface IGetTopicByInvitationCode {
  execute(code: number[] | string): Promise<TopicData | undefined>
}
