import firebase from 'firebase/app';
import 'firebase/storage';
import { ITopicImageDatabase } from 'src/data/core/topic/topicImageDatabase';

export class FirebaseTopicImageDatabase implements ITopicImageDatabase {
  private constructor(private readonly storage = firebase.storage()) {}

  private static _instance: ITopicImageDatabase;

  static get instance(): ITopicImageDatabase {
    if (!this._instance) {
      this._instance = new FirebaseTopicImageDatabase();
    }
    return this._instance;
  }

  async save(
    userId: string,
    fileName: string,
    file: File | Blob,
  ): Promise<string> {
    // expected something like 'image/jpeg'.
    const extension = file.type.split('/').pop();
    const ref = this.userRef(userId).child(`${fileName}.${extension}`);
    await ref.put(file);
    return ref.getDownloadURL();
  }

  private userRef = (userId: string) => this.storage.ref().child('users').child(userId);
}
