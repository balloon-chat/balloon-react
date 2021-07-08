import assert from 'assert';
import { isEmpty } from 'src/domain/core/string';

export class TopicTitle {
  static MAX_TITLE_LENGTH = 50;

  constructor(public readonly value: string) {
    assert(TopicTitle.require(value));
  }

  static require(value: string): boolean {
    return !isEmpty(value) && value.length <= TopicTitle.MAX_TITLE_LENGTH;
  }
}
