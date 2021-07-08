import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { ITopicImageRepository } from 'src/domain/topic/repository/topicImageRepository';
import { TopicId } from 'src/domain/topic/models/topic/topicId';
import { IllegalArgumentException } from 'src/domain/exceptions/IllegalArgumentException';
import { v4 as uuidv4 } from 'uuid';
import { TopicTitle } from 'src/domain/topic/models/topic/topicTitle';
import { IUpdateTopic, UpdateTopicArgs } from 'src/domain/topic/types/updateTopic';
import { Topic } from 'src/domain/topic/models/topic/topic';
import { TopicDescription } from 'src/domain/topic/models/topic/topicDescription';

export class UpdateTopic implements IUpdateTopic {
  constructor(
    private readonly topicRepository: ITopicRepository,
    private readonly topicImageRepository: ITopicImageRepository,
  ) {
  }

  async execute(id: string, {
    title,
    description,
    thumbnail,
    isPrivate,
  }: UpdateTopicArgs): Promise<Topic> {
    const topicId = new TopicId(id);
    const src = await this.topicRepository.find(topicId);
    if (!src) {
      throw new IllegalArgumentException(`Topic(${id}) was not found`);
    }

    let thumbnailUrl: string|undefined;
    if (thumbnail) {
      thumbnailUrl = await this.topicImageRepository.save(
        src.createdBy, uuidv4(), thumbnail,
      );
    }

    const updated = src.toTopic().copyWith({
      title: title ? new TopicTitle(title) : undefined,
      description,
      thumbnailUrl,
      isPrivate,
    });

    await this.topicRepository.updateTopic(topicId, {
      title: title ? new TopicTitle(title) : null,
      description: TopicDescription.create(description) ?? null,
      thumbnailUrl: thumbnailUrl ?? null,
      isPrivate: isPrivate ?? null,
    });

    return updated;
  }
}
