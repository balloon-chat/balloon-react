import { IGetTopicByInvitationCode } from 'src/domain/topic/types/getTopicByInvitationCode';
import { TopicData } from 'src/domain/topic/models/topic/topicData';
import { IGetTopicData } from 'src/domain/topic/types/getTopicData';
import { IInvitationRepository } from 'src/domain/topic/repository/invitationRepository';
import { InvitationCode } from 'src/domain/topic/models/invitation/invitationCode';

export class GetTopicByInvitationCode implements IGetTopicByInvitationCode {
  constructor(
    private readonly invitationRepository: IInvitationRepository,
    private readonly getTopicUsecase: IGetTopicData,
  ) {
  }

  async execute(code: number[]|string): Promise<TopicData | undefined> {
    let c: number[];
    if (typeof code === 'string') {
      // 文字列で渡されたときに値を検証
      const re = new RegExp(`^[0-9]{${InvitationCode.codeLength}}`);
      if (!re.test(code)) return undefined;
      c = code
        .split('')
        .map((s) => parseInt(s, 10));
    } else {
      c = code;
    }

    // 招待コードから話題のIDを取得
    const invitationCode = new InvitationCode(c);
    const topicId = await this.invitationRepository.findTopicIdByInvitationCode(invitationCode);
    if (!topicId) return undefined;

    // 話題を取得
    return this.getTopicUsecase.execute(topicId);
  }
}
