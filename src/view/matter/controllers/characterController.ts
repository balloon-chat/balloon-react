import { Character } from 'src/view/matter/actors/character';

export class CharacterController {
  private readonly _characters: Map<string, Character>;

  constructor() {
    this._characters = new Map();
  }

  get characters(): Character[] {
    return Array.from(this._characters.values());
  }

  inspect() {
    let str: string = 'charactersに入っている要素\n';
    this.characters.forEach((character) => {
      str += `Body: ${character.object.id}\nText: ${character.text}\n`;
    });
    console.log(str);
  }

  /**
   * マップにキャラクターを追加する
   *  @param {Character} character
   */
  add(character: Character) {
    this._characters.set(character.id, character);
    character.moveSomeWhere();
  }

  remove(character: Character) {
    this._characters.delete(character.id);
  }

  getCharacter(id: string | number): Character | undefined {
    if (typeof id === 'string') {
      return this._characters.get(id);
    }
    return this.characters.find((c) => c.object.id === id);
  }
}
