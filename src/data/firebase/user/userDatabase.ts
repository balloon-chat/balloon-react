import { IUserDatabase } from 'src/data/core/user/userDatabase';
import { UserDto } from 'src/data/core/user/userDto';
import firebase from 'firebase/app';
import 'firebase/firestore';

export class FirebaseUserDatabase implements IUserDatabase {
  private constructor(private readonly database = firebase.firestore()) {
  }

  private static _instance: IUserDatabase;

  static get instance(): IUserDatabase {
    if (!this._instance) {
      this._instance = new FirebaseUserDatabase();
    }
    return this._instance;
  }

  async find(userId: string): Promise<UserDto | undefined> {
    const snapshot = await this.document(userId).get();
    return UserDto.fromJSON(snapshot.data() ?? null);
  }

  async findByLoginId(loginId: string): Promise<UserDto | undefined> {
    const query = this.collection().where('loginId', '==', loginId);
    const snapshots = await query.get();

    let user: UserDto | null = null;
    snapshots.forEach((snapshot) => {
      const dto = UserDto.fromJSON(snapshot.data());
      if (dto) user = dto;
    });

    return user ?? undefined;
  }

  async save(user: UserDto): Promise<void> {
    return this.document(user.id).set(user.toJSON());
  }

  async update(
    userId: string,
    { name, photoUrl }: { name?: string; photoUrl?: string },
  ): Promise<void> {
    await this.database.runTransaction(async (transaction) => {
      const userRef = this.document(userId);
      const doc = await transaction.get(userRef);
      const user = UserDto.fromJSON(doc.data() ?? null);
      if (user) {
        transaction.update(userRef, {
          name,
          photoUrl,
        });
      }
    });
  }

  private collection = () => this.database.collection('users');

  private document = (userId: string) => this.collection().doc(userId);
}
