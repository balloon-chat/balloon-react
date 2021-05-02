import { IInvitationRepository } from 'src/domain/topic/repository/invitationRepository';
import { FakeBaseRepository } from 'tests/data/FakeBaseRepository';
import { TopicId } from 'src/domain/topic/models/topicId';
import { InvitationCode } from 'src/domain/topic/models/invitationCode';

type Entity = {topicId: TopicId, invitationCode: InvitationCode};

export class FakeInvitationRepository implements IInvitationRepository {
  private readonly repository = new FakeBaseRepository<string, Entity>();

  async createInvitation(topicId: TopicId):Promise< InvitationCode | null> {
    const code = new Array(InvitationCode.codeLength)
      .fill(0)
      .map(() => Math.round(Math.random() * 9));
    const invitationCode = new InvitationCode(code);
    this.repository.save(topicId.value, { topicId, invitationCode });
    return invitationCode;
  }

  async findTopicIdByInvitationCode(code: InvitationCode): Promise<TopicId | null> {
    let topicId: TopicId|null = null;
    await this.repository.findAll().forEach((e) => {
      if (e.invitationCode.isEqual(code)) {
        topicId = e.topicId;
      }
    });
    return topicId;
  }

  async findInvitationCodeByTopicId(topicId: TopicId): Promise<InvitationCode|null> {
    return this.repository.find(topicId.value)?.invitationCode ?? null;
  }

  clean() {
    this.repository.clean();
  }
}
