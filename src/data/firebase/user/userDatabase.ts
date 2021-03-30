import { IUserDatabase } from 'src/data/core/user/userDatabase';
import { UserDto } from 'src/data/core/user/userDto';
import firebase from 'firebase';

// TODO: firestoreに移行
export class FirebaseUserDatabase implements IUserDatabase {
  private constructor(private readonly database = firebase.database()) {
  }

  private static _instance: IUserDatabase;

  static get instance(): IUserDatabase {
    if (!this._instance) {
      this._instance = new FirebaseUserDatabase();
    }
    return this._instance;
  }

  async find(userId: string): Promise<UserDto | undefined> {
    const snapshot = await this.userRef(userId)
      .get();
    return UserDto.fromJSON(snapshot.toJSON());
  }

  async findByLoginId(loginId: string): Promise<UserDto | undefined> {
    const snapshot = await this.usersRef()
      .equalTo(loginId, 'loginId')
      .once('value');

    let user: UserDto | null = null;
    snapshot.forEach((snapshot) => {
      const dto = UserDto.fromJSON(snapshot);
      if (dto) user = dto;
    });

    return user ?? undefined;
  }

  async save(user: UserDto): Promise<void> {
    return this.userRef(user.id)
      .set(user);
  }

  private usersRef = () => this.database.ref('/users');

  private userRef = (userId: string) => this.usersRef()
    .child(userId);
}
