import { CharacterController } from 'src/view/matter/controllers/characterController';
import { World } from 'matter-js';
import { Character } from 'src/view/matter/actors/character/character';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';

export class PopupCharacterController extends CharacterController {
  constructor(private readonly canvas: CanvasParameter) {
    super();
  }

  add(world: World, character: Character) {
    const xDirection = Math.random() < 0.5 ? 1 : -1;
    const yDirection = Math.random() < 0.5 ? 1 : -1;
    const { width, height } = this.canvas;
    const x = width / 2 + width / 3 * Math.random() * xDirection;
    const y = height / 2 + height / 3 * Math.random() * yDirection;
    // eslint-disable-next-line no-param-reassign
    character.position = { x, y };
    // eslint-disable-next-line no-param-reassign
    character.collision = false;
    super.add(world, character);
  }
}
