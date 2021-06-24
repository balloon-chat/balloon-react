import { TopicId } from 'src/domain/topic/models/topicId';
import { InvitationCode } from 'src/domain/topic/models/invitationCode';

export interface IInvitationRepository {
  createInvitation(topicId: TopicId): Promise<InvitationCode | null>

  findTopicIdByInvitationCode(code: InvitationCode): Promise<TopicId | null>

  findInvitationCodeByTopicId(topicId: TopicId): Promise<InvitationCode|null>

  deleteInvitationOf(topicId: TopicId): Promise<void>
}
