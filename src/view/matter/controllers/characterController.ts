import { Character } from 'src/view/matter/actors/character';

export class CharacterController {
  private readonly _characters: Map<string, Character>;

  constructor() {
    this._characters = new Map();
  }

  get characters() {
    return this._characters;
  }

  inspect() {
    let str: string = 'charactersに入っている要素\n';
    const characters = Array.from(this.characters.values());
    characters.forEach((character) => {
      str += `Body: ${character.object.id}\nText: ${character.text}\n`;
    });
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
