import { Character } from 'src/view/matter/actors/character/character';

export abstract class CharacterController {
  protected readonly _characters: Map<string, Character>;

  constructor() {
    this._characters = new Map();
  }

  get characters(): Character[] {
    return Array.from(this._characters.values());
  }

  abstract onBeforeUpdate(): void

  add(character: Character) {
    this._characters.set(character.id, character);
  }

  remove(character: Character) {
    this._characters.delete(character.id);
  }

  findCharacterById(id: string | number): Character | null {
    if (typeof id === 'string') {
      return this._characters.get(id) ?? null;
    }
    return this.characters.find((c) => c.object.id === id) ?? null;
  }
}

