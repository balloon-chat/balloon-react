import firebase from 'firebase/app';
import 'firebase/storage';
import { ITopicImageRepository } from 'src/domain/topic/repository/topicImageRepository';
import { UserId } from 'src/domain/user/models/userId';

export class FirebaseTopicImageDatabase implements ITopicImageRepository {
  private constructor(private readonly storage = firebase.storage()) {}

  private static _instance: ITopicImageRepository;

  static get instance(): ITopicImageRepository {
    if (!this._instance) { this._instance = new FirebaseTopicImageDatabase(); }
    return this._instance;
  }

  async save(
    userId: UserId,
    fileName: string,
    file: File | Blob,
  ): Promise<string> {
    // expected something like 'image/jpeg'.
    const extension = file.type.split('/').pop();
    const ref = this.userRef(userId).child(`${fileName}.${extension}`);
    await ref.put(file);
    return ref.getDownloadURL();
  }

  private usersRef = () => this.storage.ref().child('users');

  private userRef = (userId: UserId) => this.usersRef().child(userId.value);
}
