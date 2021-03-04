import { v4 as uuidv4 } from 'uuid';

export class MessageId {
  constructor(public readonly value: String = uuidv4()) {
  }
}
