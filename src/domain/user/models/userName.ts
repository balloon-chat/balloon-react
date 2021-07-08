import assert from 'assert';
import { isBlank } from 'src/domain/core/string';

export class UserName {
  static readonly MAX_NAME_SIZE = 20;

  constructor(public readonly value: string) {
    assert(UserName.require(this.value));
  }

  static require(value: string): boolean {
    return !isBlank(value) && value.length <= this.MAX_NAME_SIZE;
  }
}
