import assert from 'assert';

export class RoomTitle{
  static MAX_TITLE_LENGTH = 50;

  constructor(public readonly value: string) {
    assert(RoomTitle.require(value));
  }

  static require(value: string): boolean {
    return value !== '' && value.length <= RoomTitle.MAX_TITLE_LENGTH;
  }
}
