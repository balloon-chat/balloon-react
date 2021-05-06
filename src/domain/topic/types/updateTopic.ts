import { Topic } from 'src/domain/topic/models/topic';

export type UpdateTopicArgs = {
  title?: string,
  description?: string,
  thumbnail?: File | Blob,
  isPrivate?: boolean,
}

export interface IUpdateTopic {
  execute(id: string, args: UpdateTopicArgs): Promise<Topic>;
}
