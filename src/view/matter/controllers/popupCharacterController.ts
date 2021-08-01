import { CharacterController } from 'src/view/matter/controllers/characterController';
import { Body, Engine, IEventTimestamped, World } from 'matter-js';
import { Character } from 'src/view/matter/actors/character/character';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';

export class PopupCharacterController extends CharacterController {
  add(world: World, canvas: CanvasParameter, character: Character) {
    const { width, height } = canvas;
    const xDirection = Math.random() < 0.5 ? 1 : -1;
    const yDirection = Math.random() < 0.5 ? 1 : -1;
    const x = width / 2 + width * 0.45 * Math.random() * xDirection;
    const y = height / 2 + height * 0.45 * Math.random() * yDirection;
    // eslint-disable-next-line no-param-reassign
    character.position = { x, y };

    // 衝突を検知することで、キャラクター同士のかさなりを防ぎ、マウスのドラッグもできるようにする。
    // eslint-disable-next-line no-param-reassign
    character.collision = true;

    super.add(world, canvas, character);
  }

  onBeforeUpdate(e: IEventTimestamped<Engine>) {
    super.onBeforeUpdate(e);
    this._characters.forEach((character) => {
      Body.setVelocity(character.body, {
        x: 0,
        y: Math.sin(e.timestamp / 1000 + character.body.id) * 0.1,
      });
    });
  }
}
