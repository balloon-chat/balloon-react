/* eslint-disable no-bitwise */
import Matter from 'matter-js';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';
import { MatterController } from 'src/view/matter/controllers/matterController';
import { CharacterController } from 'src/view/matter/controllers/characterController';
import { Button } from '../actors/button';
import { ButtonFactory, buttonType } from '../actors/buttonFactory';

export class MatterControllerFactory {
  static create(windowWidth: number, windowHeight: number): MatterController {
    const engine = Matter.Engine.create();
    const canvas = new CanvasParameter(windowWidth, windowHeight);

    // キャラクターを管理するクラス
    const characterController = new CharacterController();

    // ボタンを生成
    const addButton = ButtonFactory.create(Button.radius, 150, buttonType.add, 'blue');
    const removeAllButton = ButtonFactory.create(Button.radius, 150 + Button.radius * 2, buttonType.removeAll, 'green');
    const shakeAllButton = ButtonFactory.create(Button.radius, 150 + Button.radius * 4, buttonType.shakeAll, 'red');

    return new MatterController(
      engine,
      [addButton, removeAllButton, shakeAllButton],
      characterController,
      canvas,
    );
  }
}
