import { Character } from 'src/view/matter/actors/character';
import { Bodies } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';

export class CharacterFactory {
  static create(canvas: CanvasParameter, id: string, text: string): Character {
    const radius: number = 100;
    return new Character(
        id,
        Bodies.circle(canvas.center.x, canvas.center.y, radius, { restitution: 0, friction: 0 }),
        text,
        radius
    );
  }
}
