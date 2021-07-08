import { UserDto } from 'src/data/firebase/user/types/userDto';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';

export class FirebaseUserDatabase implements IUserRepository {
  private constructor(private readonly database = firebase.firestore()) {
  }

  private static _instance: IUserRepository;

  static get instance(): IUserRepository {
    if (!this._instance) { this._instance = new FirebaseUserDatabase(); }

    return this._instance;
  }

  async find(userId: UserId): Promise<LoginUser | null> {
    const snapshot = await this.document(userId).get();
    const dto = UserDto.fromJSON(snapshot.data() ?? null);
    return dto?.toUser() ?? null;
  }

  async findByLoginId(loginId: string): Promise<LoginUser | null> {
    const query = this.collection().where('loginId', '==', loginId);
    const snapshots = await query.get();

    let user: UserDto | undefined;
    snapshots.forEach((snapshot) => {
      const dto = UserDto.fromJSON(snapshot.data());
      if (dto) user = dto;
    });

    return user?.toUser() ?? null;
  }

  async save(user: LoginUser): Promise<void> {
    const dto = UserDto.from(user);
    return this.document(user.id).set(dto.toJSON());
  }

  async update(
    userId: UserId,
    {
      name,
      photoUrl,
    }: {
      name?: UserName,
      photoUrl?: string
    },
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

  private document = (userId: UserId) => this.collection().doc(userId.value);
}
