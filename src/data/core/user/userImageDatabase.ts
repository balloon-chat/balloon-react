export interface IUserImageDatabase {
  save(userId: string, file: File): Promise<string>
}
