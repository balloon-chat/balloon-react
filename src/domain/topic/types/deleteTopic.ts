export interface IDeleteTopic {
  execute(topicId: string): Promise<void>
}
