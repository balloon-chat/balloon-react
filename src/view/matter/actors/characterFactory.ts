import { Character } from 'src/view/matter/actors/character';
import { Bodies } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';

export class CharacterFactory {
  static create(canvas: CanvasParameter, id: string, text: string): Character {
    const radius: number = 250;
    const x = canvas.center.x + Math.random() * 10;
    const y = canvas.center.y + Math.random() * 10;
    return new Character(
        id,
        Bodies.circle(x, y, radius, { restitution: 0 }),
        text,
        radius,
    );
  }
}
