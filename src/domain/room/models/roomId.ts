import { v4 as uuidv4 } from 'uuid';

export class RoomId {
  constructor(public readonly value: string = uuidv4()) {
  }
}
