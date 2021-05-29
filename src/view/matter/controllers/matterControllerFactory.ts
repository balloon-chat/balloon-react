import { Engine } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';
import { MatterController } from 'src/view/matter/controllers/matterController';
import { CharacterController } from 'src/view/matter/controllers/characterController';
import { Button } from 'src/view/matter/actors/button/button';
import { ButtonFactory, buttonType } from 'src/view/matter/actors/button/buttonFactory';

export class MatterControllerFactory {
  private static _instance: MatterController | null;

  static create(windowWidth: number, windowHeight: number): MatterController {
    if (this._instance) return this._instance;

    const engine = Engine.create();
    const canvas = new CanvasParameter(windowWidth, windowHeight);

    // キャラクターを管理するクラス
    const characterController = new CharacterController();

    // ボタンを生成
    const addButton = ButtonFactory.create(Button.radius, Button.radius, buttonType.add, 'blue');
    const removeAllButton = ButtonFactory.create(Button.radius * 3, Button.radius, buttonType.removeAll, 'green');
    const shakeAllButton = ButtonFactory.create(Button.radius * 5, Button.radius, buttonType.shakeAll, 'red');

    this._instance = new MatterController(
      engine,
      [addButton, removeAllButton, shakeAllButton],
      characterController,
      canvas,
    );

    return this._instance;
  }
}
