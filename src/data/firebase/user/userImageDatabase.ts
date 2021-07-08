import firebase from 'firebase/app';
import 'firebase/storage';
import { UserId } from 'src/domain/user/models/userId';
import { IUserImageRepository } from 'src/domain/user/repository/userImageRepository';

export class FirebaseUserImageDatabase implements IUserImageRepository {
  private constructor(private readonly storage = firebase.storage()) {
  }

  private static _instance: IUserImageRepository;

  static get instance(): IUserImageRepository {
    if (!this._instance) { this._instance = new FirebaseUserImageDatabase(); }
    return this._instance;
  }

  async save(userId: UserId, file: File): Promise<string> {
    const ref = this.userProfileRef(userId).child(file.name);
    await ref.put(file);
    return ref.getDownloadURL();
  }

  private usersRef = () => this.storage.ref().child('users');

  private userRef = (userId: UserId) => this.usersRef().child(userId.value)

  private userProfileRef = (userId: UserId) => this.userRef(userId).child('profile');
}
