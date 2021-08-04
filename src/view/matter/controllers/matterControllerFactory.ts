import { Engine } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';
import { MatterController } from 'src/view/matter/controllers/matterController';
import { CharacterController } from 'src/view/matter/controllers/characterController';
import { PopupCharacterController } from 'src/view/matter/controllers/popupCharacterController';

export class MatterControllerFactory {
  private static _instance: MatterController | null;

  // eslint-disable-next-line max-len
  static create(windowWidth: number, windowHeight: number): MatterController {
    if (this._instance) return this._instance;

    const engine = Engine.create();
    const canvas = new CanvasParameter(windowWidth, windowHeight);

    // キャラクターを管理するクラス
    const characterController: CharacterController = new PopupCharacterController();

    this._instance = new MatterController(
      engine,
      characterController,
      canvas,
    );

    return this._instance;
  }
}
