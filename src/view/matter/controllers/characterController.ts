import { Character } from 'src/view/matter/actors/character/character';
import { Body } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';

export class CharacterController {
  private readonly _characters: Map<string, Character>;

  private latestCharacterId: string | null = null;

  constructor() {
    this._characters = new Map();
  }

  get characters(): Character[] {
    return Array.from(this._characters.values());
  }

  get latestCharacter(): Character | null {
    if (!this.latestCharacterId) return null;
    return this.findCharacterById(this.latestCharacterId);
  }

  add(character: Character) {
    this._characters.set(character.id, character);
    this.latestCharacterId = character.id;
    character.moveSomeWhere();
  }

  remove(character: Character) {
    this._characters.delete(character.id);
  }

  onBeforeUpdate(canvas: CanvasParameter) {
    // 最新のキャラクターは常に中央に配置
    /**
    if (this.latestCharacter) {
      Body.setPosition(this.latestCharacter.object, {
        x: canvas.center.x,
        y: canvas.center.y,
      });
    }
    */
    this.characters.forEach((character) => character.onBeforeUpdate());
  }

  findCharacterById(id: string | number): Character | null {
    if (typeof id === 'string') {
      return this._characters.get(id) ?? null;
    }
    return this.characters.find((c) => c.object.id === id) ?? null;
  }
}
