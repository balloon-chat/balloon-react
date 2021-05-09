import { Character } from 'src/view/matter/actors/character';
import { Bodies, Vector } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';
import P5Types from 'p5';

enum CharacterSize {
  small = 80,
  medium = 120,
  large = 160,
}

const characterColors: string[] = [
  '#AEE1E1',
  '#F4D160',
  '#FAD1D1',
];

type CharacterFactoryParams = {
  id: string,
  message: string,
  senderId: string
}

export class CharacterFactory {
  /**
   * @param p5 描画用のp5インスタンス
   * @param canvas キャンバスサイズ キャラクターの配置位置を決めるために利用
   * @param id メッセージのID
   * @param message メッセージ
   * @param senderId 送信者のID 同じIDなら、キャラクターの色が同じになる
   */
  static create(
    p5: P5Types,
    canvas: CanvasParameter,
    { id, message, senderId }: CharacterFactoryParams,
  ): Character {
    const radius = this.getCharacterSize(p5, message);
    const sign = {
      x: Math.random() > 0.5 ? 1 : -1,
      y: Math.random() > 0.5 ? 1 : -1,
    };
    const generatePosition = Vector.create(
      canvas.center.x + sign.x * 50 * Math.random(),
      canvas.center.y + sign.y * 50 * Math.random(),
    );
    const color = characterColors[senderId.charCodeAt(0) % characterColors.length];
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
      message,
      radius,
      color,
    );
  }

  static getCharacterSize(p5: P5Types, text: string): CharacterSize {
    let lines = Character.getTextLines(p5, text, CharacterSize.small).length;
    if (lines <= 3) return CharacterSize.small;

    lines = Character.getTextLines(p5, text, CharacterSize.medium).length;
    if (lines <= 3) return CharacterSize.medium;

    return CharacterSize.large;
  }
}
