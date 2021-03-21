import { Character } from 'src/view/matter/actors/character';

export class CharacterController {

  // tslint:disable-next-line:variable-name
  private readonly _characters: Map<number, Character>;

  constructor() {
    this._characters = new Map<number, Character>();
  }

  get characters() {
    return this._characters;
  }

  show() {
    let str: string = 'charactersに入っている要素\n';
    for (const character of Array.from(this.characters.values())) {
      str += `${character}\n`;
    }
    console.log(str);
  }

  /** マップにキャラクターを追加する
   *  @param {Character} character
   */
  add(character: Character) {
    this.characters.set(character.object.id, character);
  }

  /** マップのキャラクターを削除 (オブジェクト指定)
   *  @param {Character} character
   */
  removeByCharacter(character: Character) {
    this.characters.delete(character.object.id);
  }

  /** idに応じてキャラクターを返す
   *  @param {number} id
   *  @return {Character}
   */
  getCharacter(id: number): Character | undefined {
    return this.characters.get(id);
  }

  /** idが衝突していないかを調べる
   *  @param {Character} character
   */
  isIdCollision(character: Character): boolean {
    for (const key of Array.from(this.characters.keys())) {
      if (this.characters.get(key)?.id === character.id) return true;
    }
    return false;
  }
}
