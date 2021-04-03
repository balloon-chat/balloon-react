import { Character } from 'src/view/matter/actors/character';
import { Bodies } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';

export class CharacterFactory {
  static create(canvas: CanvasParameter, id: string, text: string): Character {
    const radius: number = 200;
    // eslint-disable-next-line prefer-destructuring
    const x = canvas.center.x;
    // eslint-disable-next-line prefer-destructuring
    const y = canvas.center.y;
    return new Character(
      id,
      Bodies.circle(x, y, radius, {
        inertia: Infinity,
        frictionAir: 0,
      }),
      text,
    );
  }
}
