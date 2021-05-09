import { Character } from 'src/view/matter/actors/character';

export class CharacterController {
  private readonly _characters: Map<string, Character>;

  public latestCharacterId: string = 'init';

  public latestCharacterPosition = {
    x: 0,
    y: 0,
  };

  constructor() {
    this._characters = new Map();
  }

  get characters() {
    return this._characters;
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
