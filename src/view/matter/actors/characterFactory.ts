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
  static create(canvas: CanvasParameter, id: string, text: string): Character {
    const p5 = new P5Types(() => {});
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

  static measureTextLength(text: string, size: CharacterSize, p5: P5Types): number {
    // textの描画
    const textSize = 16;
    const degree = 40; // 度数法で入力 ( 0 < degree < 90 )
    const radian = (degree * Math.PI) / 180; // 弧度法
    const rCosine = size * Math.cos(radian);
    const textBoxWidth = 2 * rCosine * 1.25;
    let sliceStr = text;
    let printText = '';
    const list = [];

    p5.textSize(textSize);
    // listにtextを区切って格納
    for (let i = 0, textWidth = 0; i < text.length; i += 1) {
      if (textWidth + p5.textWidth(sliceStr.charAt(0)) > textBoxWidth) {
        list.push(printText);
        textWidth = 0;
        printText = '';
      }
      printText += sliceStr.charAt(0);
      textWidth += p5.textWidth(sliceStr.charAt(0));
      sliceStr = sliceStr.slice(1, sliceStr.length);
    }
    list.push(printText);

    return list.length;
  }
}
