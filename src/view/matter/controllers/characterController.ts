import { Character } from 'src/view/matter/actors/character/character';
import P5Types from 'p5';
import { Body, Engine, IEventTimestamped, World } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';

export abstract class CharacterController {
  protected readonly _characters: Map<string, Character>;

  private lastUpdateAt: number = 0;

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
    const current = Date.now();
    if (current - this.lastUpdateAt > 400) {
      // TODO: 送信音の有無の設定ができるようにする。
      const audio = new Audio('/sound/popup.mp3');
      audio.play().catch((e) => {
        console.error(e);
      });
      this.lastUpdateAt = current;
    }

    this._characters.set(character.id, character);
    character.popout(500, () => { World.add(world, character.body); });
  }

  remove(world: World, character: Character, { animate }: {animate: boolean} = { animate: true }) {
    // eslint-disable-next-line no-underscore-dangle
    const _remove = () => {
      World.remove(world, character.body);
      this._characters.delete(character.id);
    };

    if (!animate) {
      _remove();
      return;
    }
    character.fadeout(400, _remove);
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
