export interface ITopicImageDatabase {
  save(userId: string, fileName: string, file: File | Blob): Promise<string>;
}
