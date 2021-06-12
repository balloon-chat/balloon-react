import { Character } from 'src/view/matter/actors/character/character';
import P5Types from 'p5';
import { Body, Engine, IEventTimestamped, World } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';

export abstract class CharacterController {
  protected readonly _characters: Map<string, Character>;

  constructor() {
    this._characters = new Map();
  }

  get characters(): Character[] {
    return Array.from(this._characters.values());
  }

  onBeforeUpdate(_: IEventTimestamped<Engine>): void {
    this._characters.forEach((character) => {
      // 回転の防止
      Body.setAngle(character.body, 0);
    });
  }

  add(world: World, _: CanvasParameter, character: Character) {
    World.add(world, character.body);
    this._characters.set(character.id, character);
  }

  remove(world: World, character: Character) {
    World.remove(world, character.body);
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
    return this.characters.find((c) => c.body.id === id) ?? null;
  }
}
