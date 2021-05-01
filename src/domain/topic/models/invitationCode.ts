import assert from 'assert';

export class InvitationCode {
  static codeLength = 8;

  constructor(readonly code: number[]) {
    assert(code.length >= 2);
  }

  get formatCode(): string {
    let divIndex: number;
    if (this.code.length % 2 === 0) {
      divIndex = this.code.length / 2;
    } else {
      divIndex = (this.code.length + 1) / 2;
    }

    const codeLeft = this.code
      .slice(0, divIndex)
      .join('');
    const codeRight = this.code
      .slice(divIndex, this.code.length)
      .join('');

    return `${codeLeft}-${codeRight}`;
  }

  isEqual(other: InvitationCode): boolean {
    if (this.code.length !== other.code.length) return false;
    return this.code.every((c, i) => c === other.code[i]);
  }
}
