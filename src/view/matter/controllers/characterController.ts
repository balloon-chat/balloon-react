import { Character } from 'src/view/matter/actors/character/character';

export class CharacterController {
  private readonly _characters: Map<string, Character>;

  constructor() {
    this._characters = new Map();
  }

  get characters(): Character[] {
    return Array.from(this._characters.values());
  }

  add(character: Character) {
    this._characters.set(character.id, character);
    character.moveSomeWhere();
  }

  remove(character: Character) {
    this._characters.delete(character.id);
  }

  onBeforeUpdate() {
    this.characters.forEach((character) => character.onBeforeUpdate());
  }

  findCharacterById(id: string | number): Character | null {
    if (typeof id === 'string') {
      return this._characters.get(id) ?? null;
    }
    return this.characters.find((c) => c.object.id === id) ?? null;
  }
}
