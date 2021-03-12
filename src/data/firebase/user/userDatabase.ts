import { IUserDatabase } from 'src/data/core/user/userDatabase';
import { UserDto } from 'src/data/core/user/userDto';
import firebase from 'firebase';

export class FirebaseUserDatabase implements IUserDatabase {
  constructor(
      private readonly database = firebase.database(),
  ) {
  }

  // tslint:disable-next-line:variable-name
  private static _instance: IUserDatabase;

  static get instance(): IUserDatabase {
    if (!this._instance) {
      this._instance = new FirebaseUserDatabase();
    }
    return this._instance;
  }

  async find(userId: string): Promise<UserDto | undefined> {
    const snapshot = await this.userRef(userId).get();
    return UserDto.fromJSON(snapshot.toJSON());
  }

  private usersRef = () => this.database.ref('/users');
  private userRef = (userId: string) => this.usersRef().child(userId);
}
