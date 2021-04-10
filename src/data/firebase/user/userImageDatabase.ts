import firebase from 'firebase/app';
import 'firebase/storage';
import { IUserImageDatabase } from 'src/data/core/user/userImageDatabase';

export class FirebaseUserImageDatabase implements IUserImageDatabase {
  private constructor(private readonly storage = firebase.storage()) {
  }

  private static _instance: IUserImageDatabase;

  static get instance(): IUserImageDatabase {
    if (!this._instance) {
      this._instance = new FirebaseUserImageDatabase();
    }
    return this._instance;
  }

  async save(userId: string, file: File): Promise<string> {
    const ref = this.userProfileRef(userId).child(file.name);
    await ref.put(file);
    return ref.getDownloadURL();
  }

  private userProfileRef = (userId: string) => this.storage.ref().child('users').child(userId).child('profile');
}
