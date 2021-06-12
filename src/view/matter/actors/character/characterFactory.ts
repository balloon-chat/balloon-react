import { Character } from 'src/view/matter/actors/character/character';
import { Bodies, Vector } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';
import P5Types from 'p5';
import { CharacterDrawer } from 'src/view/matter/actors/character/characterDrawer';

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
  senderId: string,
  sender: string,
}

export class CharacterFactory {
  /**
   * @param p5 描画用のp5インスタンス
   * @param isMobile 表示されるのが小さい画面の場合、キャラクターの大きさを小さくする
   * @param canvas キャンバスサイズ キャラクターの配置位置を決めるために利用
   * @param id メッセージのID
   * @param message メッセージ
   * @param senderId 送信者のID 同じIDなら、キャラクターの色が同じになる
   * @param sender 送信者の名前
   */
  static create(
    p5: P5Types,
    isMobile: boolean,
    canvas: CanvasParameter,
    { id, message, senderId, sender }: CharacterFactoryParams,
  ): Character {
    const radius = this.getCharacterSize(p5, isMobile, message);
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
      }),
      message,
      sender,
      radius,
      color,
    );
  }

  static getCharacterSize(p5: P5Types, isMobile:boolean, text: string): CharacterSize {
    // モバイルで表示するときは、キャラクターの大きさを75%にする
    const expansionRate = isMobile ? 0.75 : 1.0;

    let characterSize = CharacterSize.small * expansionRate;
    let lines = CharacterDrawer.getTextLines(p5, text, characterSize).length;
    if (lines <= 3) return characterSize;

    characterSize = CharacterSize.medium * expansionRate;
    lines = CharacterDrawer.getTextLines(p5, text, characterSize).length;
    if (lines <= 3) return characterSize;

    return CharacterSize.large * expansionRate;
  }
}
