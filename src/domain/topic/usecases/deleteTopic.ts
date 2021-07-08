import { IDeleteTopic } from 'src/domain/topic/types/deleteTopic';
import { IInvitationRepository } from 'src/domain/topic/repository/invitationRepository';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { TopicId } from 'src/domain/topic/models/topic/topicId';
import { ITopicRepository } from '../repository/topicRepository';

export class DeleteTopic implements IDeleteTopic {
  constructor(
    private readonly topicRepository: ITopicRepository,
    private readonly invitationRepository: IInvitationRepository,
    private readonly messageRepository: IMessageRepository,
  ) {}

  async execute(topicId: string): Promise<void> {
    const id = new TopicId(topicId);
    const topic = await this.topicRepository.find(id);
    if (!topic) return;

    await Promise.all([
      this.topicRepository.delete(id),
      this.messageRepository.deleteAllMessagesOf(id),
      this.invitationRepository.deleteInvitationOf(id),
    ]);
  }
}
