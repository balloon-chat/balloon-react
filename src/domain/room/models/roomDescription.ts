import assert from 'assert';

export class RoomDescription {
  static MAX_DESCRIPTION_LENGTH = 50;

  private constructor(public readonly value: string) {
    assert(RoomDescription.require(value));
  }

  static require(value: string): boolean {
    return value !== '' && value.length <= RoomDescription.MAX_DESCRIPTION_LENGTH;
  }

  /**
   * value が条件を満たしたときのみ、RoomDescriptionを作成する。
   */
  static create(value?: string): RoomDescription | undefined {
    if (value && RoomDescription.require(value)) {
      return new RoomDescription(value);
    }
  }
}
