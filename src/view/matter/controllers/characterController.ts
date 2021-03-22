import { Character } from 'src/view/matter/actors/character';

export class CharacterController {

  // tslint:disable-next-line:variable-name
  private readonly _characters: Map<string, Character>;

  constructor() {
    this._characters = new Map();
  }

  get characters() {
    return this._characters;
  }

  inspect() {
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
    this.characters.set(character.id, character);
  }

  remove(character: Character) {
    this.characters.delete(character.id);
  }

  getCharacter(id: string | number): Character | undefined {
    if (typeof id === 'string') {
      return this.characters.get(id);
    }
    return Array.from(this.characters.values()).find((c) => c.object.id === id);
  }
}
