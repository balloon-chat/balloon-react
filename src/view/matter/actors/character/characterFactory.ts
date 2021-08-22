import { Character } from 'src/view/matter/actors/character/character';
import { Vector } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/types/util/canvasParameter';
import P5Types from 'p5';
import { CharacterDrawer } from 'src/view/matter/actors/character/characterDrawer';
import { PopupCharacterController } from 'src/view/matter/controllers/character/popupCharacterController';
import { CharacterParams } from 'src/view/matter/actors/character/characterParams';

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
    const radius = CharacterDrawer.getCharacterSize(p5, isMobile, message);
    const sign = {
      x: Math.random() > 0.5 ? 1 : -1,
      y: Math.random() > 0.5 ? 1 : -1,
    };
    const position = Vector.create(
      canvas.center.x + sign.x * 50 * Math.random(),
      canvas.center.y + sign.y * 50 * Math.random(),
    );
    const color = characterColors[senderId.charCodeAt(0) % characterColors.length];

    const controller = new PopupCharacterController();

    const params = new CharacterParams({
      position,
      color,
      collision: false,
      scale: 1.0,
      opacity: 1.0,
      radius,
      message,
      sender,
    });

    return new Character(id, params, [controller]);
  }
}
