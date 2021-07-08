import { ITopicRepository, UpdateTopicParams } from 'src/domain/topic/repository/topicRepository';
import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { TopicId } from 'src/domain/topic/models/topicId';
import { FakeBaseRepository } from 'tests/data/FakeBaseRepository';
import { UserId } from 'src/domain/user/models/userId';
import { BranchTopicEntity } from 'src/domain/topic/repository/branchTopicEntity';
import { BranchTopic, BranchTopicId } from 'src/domain/topic/models/branchTopic';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export class FakeTopicRepository implements ITopicRepository {
  // key: topic id
  private readonly repository = new FakeBaseRepository<string, TopicEntity>();

  find(topicId: TopicId): Promise<TopicEntity | undefined> {
    return Promise.resolve(this.repository.find(topicId.value));
  }

  async findBranchTopic(
    topicId: TopicId,
    branchTopicId: BranchTopicId,
  ): Promise<BranchTopic|null> {
    const topic = this.repository.find(topicId.value);
    if (!topic) return null;

    return topic.branchTopics.find((e) => e.id.value === branchTopicId.value) ?? null;
  }

  /**
   * デバッグ用
   */
  findAll(): Promise<TopicEntity[]> {
    return Promise.resolve(this.repository.findAll());
  }

  findAllTopicsCreatedBy(createdBy: UserId): Promise<TopicEntity[]> {
    const result = this.repository
      .findAll()
      .filter((topic) => topic.createdBy.value === createdBy.value);
    return Promise.resolve(result);
  }

  findAllPublicTopicsCreatedBy(createdBy: UserId): Promise<TopicEntity[]> {
    const result = this.repository
      .findAll()
      .filter((topic) => topic.createdBy.value === createdBy.value)
      .filter((topic) => !topic.isPrivate);
    return Promise.resolve(result);
  }

  findAllPublicTopicsOrderByCreatedAt(limit: number, from?: TopicId): Promise<TopicEntity[]> {
    const result = this.repository.findAll()
      .sort((a, b) => b.createdAt - a.createdAt)
      .filter((topic) => !topic.isPrivate);

    if (from) {
      const fromIndex = result.findIndex((topic) => topic.id.value === from.value);
      return Promise.resolve(result.slice(fromIndex, fromIndex + limit));
    }

    return Promise.resolve(result.slice(0, limit));
  }

  observeTopic(topicId: TopicId, _?: Subject<void>): Observable<TopicEntity | null> {
    return this.repository.observe(topicId.value)
      .pipe(
        map((value) => value ?? null),
      );
  }

  async updateTopic(topicId: TopicId, {
    title,
    description,
    thumbnailUrl,
    isPrivate,
  }: UpdateTopicParams): Promise<void> {
    const old = this.repository.find(topicId.value);
    if (!old) return;
    const updated = old.toTopic()
      .copyWith({
        title: title ?? undefined,
        description: description?.value,
        thumbnailUrl: thumbnailUrl ?? undefined,
        isPrivate: isPrivate ?? undefined,
      });
    this.repository.save(topicId.value, TopicEntity.from(updated));
  }

  async save(topic: TopicEntity): Promise<void> {
    await this.repository.save(topic.id.value, topic);
  }

  async delete(topicId: TopicId): Promise<void> {
    this.repository.delete(topicId.value);
  }

  async addBranchTopic(topicId: TopicId, branchTopic: BranchTopicEntity): Promise<void> {
    const entity = this.repository.find(topicId.value);
    if (!entity) return;

    this.repository.delete(topicId.value);

    const topic = entity.toTopic();
    topic.addBranchTopic(branchTopic);
    this.repository.save(topicId.value, TopicEntity.from(topic));
  }

  async deleteBranchTopic(topicId: TopicId, branchTopicId: BranchTopicId): Promise<void> {
    const entity = this.repository.find(topicId.value);
    if (!entity) return;

    this.repository.delete(topicId.value);

    const topic = entity.toTopic();
    topic.deleteBranchTopic(branchTopicId);
    this.repository.save(topicId.value, TopicEntity.from(topic));
  }

  clean() {
    this.repository.clean();
  }
}
