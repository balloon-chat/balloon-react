import assert from 'assert';
import { isNotBlank } from 'src/domain/core/string';

export class TopicDescription {
  static MAX_DESCRIPTION_LENGTH = 50;

  private constructor(public readonly value: string) {
    assert(TopicDescription.require(value));
  }

  static require(value: string): boolean {
    return (
      isNotBlank(value)
      && value.length <= TopicDescription.MAX_DESCRIPTION_LENGTH
    );
  }

  /**
   * 条件を満たしたときのみ、{@link TopicDescription}を作成する。
   */
  static create(value?: string | null): TopicDescription | undefined {
    if (value && TopicDescription.require(value)) {
      return new TopicDescription(value);
    }
    return undefined;
  }
}
