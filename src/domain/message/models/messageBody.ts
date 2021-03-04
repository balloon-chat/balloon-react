import assert from 'assert';

export class MessageBody {
  static MAX_MESSAGE_SIZE = 50;

  constructor(public readonly value: string) {
    assert(MessageBody.require(this.value));
  }

  /**
   * @return true もしvalueが空文字でなく、文字数が MAX_MESSAGE_SIZE 以下であるとき
   */
  static require(value: string): boolean {
    return value !== '' && value.length <= MessageBody.MAX_MESSAGE_SIZE;
  }
}
