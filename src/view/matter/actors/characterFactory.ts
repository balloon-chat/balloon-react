/* eslint-disable no-bitwise */
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
    let lines = this.measureTextLength(text, CharacterSize.small, p5);
    let radius: number = CharacterSize.small;
    if (lines > 3) {
      lines = this.measureTextLength(text, CharacterSize.medium, p5);
      radius = CharacterSize.medium;
      if (lines > 3) {
        lines = this.measureTextLength(text, CharacterSize.large, p5);
        radius = CharacterSize.large;
      }
    }
    // eslint-disable-next-line prefer-destructuring
    const x = canvas.center.x;
    // eslint-disable-next-line prefer-destructuring
    const y = canvas.center.y;
    return new Character(
      id,
      Bodies.circle(x, y, radius, {
        inertia: Infinity,
        frictionAir: 0,
        restitution: 0.3,
        collisionFilter: {
          group: 0,
          category: 0x0002,
          mask: 0x0002 | 0x0001,
        },
      }),
      text,
      radius,
      characterColors[Math.floor(Math.random() * characterColors.length)],
    );
  }

  static getCharacterSize(p5: P5Types, text: string): CharacterSize {
    let lines = Character.getTextLines(p5, text, CharacterSize.small).length;
    if (lines < 3) return CharacterSize.small;

    lines = Character.getTextLines(p5, text, CharacterSize.medium).length;
    if (lines < 3) return CharacterSize.medium;

    return CharacterSize.large;
  }
}
