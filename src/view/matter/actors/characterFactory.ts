import { Character } from 'src/view/matter/actors/character';
import { Bodies } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/controllers/canvasParameter';

export class CharacterFactory {
  static create(canvas: CanvasParameter, text: string): Character {
    return new Character(
        Bodies.circle(canvas.center.x, canvas.center.y, 30, { restitution: 0, friction: 0 }),
        text,
    );
  }
}
