/* eslint-disable no-bitwise */
import Matter from 'matter-js';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';
import { MatterController } from 'src/view/matter/controllers/matterController';
import { CharacterController } from 'src/view/matter/controllers/characterController';
import { Button } from 'src/view/matter/actors/button/button';
import { ButtonFactory, buttonType } from 'src/view/matter/actors/button/buttonFactory';

export class MatterControllerFactory {
  private static _instance: MatterController | null;

  static create(windowWidth: number, windowHeight: number): MatterController {
    if (this._instance) return this._instance;

    const engine = Matter.Engine.create();
    const canvas = new CanvasParameter(windowWidth, windowHeight);

    // キャラクターを管理するクラス
    const characterController = new CharacterController();

    // ボタンを生成
    const addButton = ButtonFactory.create(Button.radius, 150, buttonType.add, 'blue');
    const removeAllButton = ButtonFactory.create(Button.radius, 150 + Button.radius * 2, buttonType.removeAll, 'green');
    const shakeAllButton = ButtonFactory.create(Button.radius, 150 + Button.radius * 4, buttonType.shakeAll, 'red');

    this._instance = new MatterController(
      engine,
      [addButton, removeAllButton, shakeAllButton],
      characterController,
      canvas,
    );

    return this._instance;
  }
}
