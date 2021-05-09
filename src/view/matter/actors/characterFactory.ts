import { Character } from 'src/view/matter/actors/character';
import { Bodies } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';
import P5Types from 'p5';

export enum CharacterSize {
  small = 80,
  medium = 120,
  large = 160,
}

const characterColors: string[] = [
  '#AEE1E1',
  '#F4D160',
  '#FAD1D1',
];

export class CharacterFactory {
  static create(p5: P5Types, canvas: CanvasParameter, id: string, text: string): Character {
    const radius = this.getCharacterSize(p5, text);
    const sign = {
      x: Math.random() < 0.5 ? -1 : 1,
      y: Math.random() < 0.5 ? -1 : 1,
    };

    const generatePosition = {
      x: canvas.center.x + sign.x * Math.random(),
      y: canvas.center.y + sign.y * Math.random(),
    };
    return new Character(
      id,
      Bodies.circle(generatePosition.x, generatePosition.y, radius, {
        inertia: Infinity,
        frictionAir: 0,
        restitution: 0.3,
        collisionFilter: {
          group: 0,
          category: 0x0002,
          // eslint-disable-next-line no-bitwise
          mask: 0x0002 | 0x0001,
        },
      }),
      text,
      radius,
      characterColors[Math.floor(Math.random() * characterColors.length)],
    );
  }

  static getCharacterSize(p5: P5Types, text: string): CharacterSize {
    let lines = Character.getTextLines(text, CharacterSize.small, p5).length;
    if (lines <= 3) return CharacterSize.small;

    lines = Character.getTextLines(text, CharacterSize.medium, p5).length;
    if (lines <= 3) return CharacterSize.medium;

    return CharacterSize.large;
  }
}
