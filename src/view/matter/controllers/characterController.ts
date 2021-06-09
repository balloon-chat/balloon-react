import { Character } from 'src/view/matter/actors/character/character';
import P5Types from 'p5';
import { Body, World } from 'matter-js';

export abstract class CharacterController {
  protected readonly _characters: Map<string, Character>;

  constructor() {
    this._characters = new Map();
  }

  get characters(): Character[] {
    return Array.from(this._characters.values());
  }

  onBeforeUpdate(): void {
    this._characters.forEach((character) => {
      // 回転の防止
      Body.setAngle(character.object, 0);
    });
  }

  add(world: World, character: Character) {
    World.add(world, character.object);
    this._characters.set(character.id, character);
  }

  remove(world: World, character: Character) {
    World.remove(world, character.object);
    this._characters.delete(character.id);
  }

  draw(p5: P5Types) {
    this.characters.forEach((character) => {
      character.draw(p5);
    });
  }

  findCharacterById(id: string | number): Character | null {
    if (typeof id === 'string') {
      return this._characters.get(id) ?? null;
    }
    return this.characters.find((c) => c.object.id === id) ?? null;
  }
}
