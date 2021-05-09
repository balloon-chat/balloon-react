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

  get characters(): Character[] {
    return Array.from(this._characters.values());
  }

  /**
   * マップにキャラクターを追加する
   */
  add(character: Character) {
    this._characters.set(character.id, character);
    character.moveSomeWhere();
  }

  /**
   * マップのキャラクターを削除する
   */
  remove(character: Character) {
    this._characters.delete(character.id);
  }

  /**
   * 渡されたidに対応するキャラクターを返す
   */
  getCharacter(id: string | number): Character | undefined {
    if (typeof id === 'string') {
      return this._characters.get(id);
    }
    return this.characters.find((c) => c.object.id === id);
  }
}
