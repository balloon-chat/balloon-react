import { v4 as uuidv4 } from 'uuid';

export class UserId {
  constructor(public readonly value: String = uuidv4()) {
  }
}
