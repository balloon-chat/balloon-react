import { v4 as uuidv4 } from 'uuid';
import { isNotBlank } from 'src/domain/core/string';
import { IllegalArgumentException } from 'src/domain/exceptions/IllegalArgumentException';

export class UniqueId {
  constructor(public readonly value: string = uuidv4()) {
    if (!UniqueId.require(value)) throw new IllegalArgumentException('value should not be empty');
  }

  static require(value: string): boolean {
    return isNotBlank(value);
  }
}
