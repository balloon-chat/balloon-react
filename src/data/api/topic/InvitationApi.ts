import { InvitationCode } from 'src/domain/topic/models/invitationCode';
import { TopicId } from 'src/domain/topic/models/topicId';
import { IInvitationRepository } from 'src/domain/topic/repository/invitationRepository';
import axios, { AxiosResponse } from 'axios';

export class InvitationApi implements IInvitationRepository {
  // eslint-disable-next-line class-methods-use-this
  async createInvitation(topicId: TopicId): Promise<InvitationCode | null> {
    try {
      const res = await axios.post<any, AxiosResponse<{ topicId: string, code: number[] }>>(
        process.env.CREATE_INVITATION_API_URL!,
        { topicId: topicId.value },
      );
      return new InvitationCode(res.data.code);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async findTopicIdByInvitationCode(code: InvitationCode): Promise<TopicId | null> {
    try {
      const res = await axios.post<any, AxiosResponse<{ topicId: string }>>(
        process.env.CREATE_INVITATION_API_URL!,
        { code: code.code },
      );

      return new TopicId(res.data.topicId);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async findInvitationCodeByTopicId(topicId: TopicId): Promise<InvitationCode | null> {
    try {
      const res = await axios.post<any, AxiosResponse<{ code: number[] }>>(
        process.env.INVITATION_CODE_API_URL!,
        { topicId: topicId.value },
      );

      return new InvitationCode(res.data.code);
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
