import { Character } from 'src/view/matter/actors/character/character';
import { CharacterController } from 'src/view/matter/controllers/characterController';
import { Engine, IEventTimestamped, World } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';

export class BoundCharacterController extends CharacterController {
  add(world: World, canvas: CanvasParameter, character: Character) {
    character.moveSomeWhere();
    super.add(world, canvas, character);
  }

  onBeforeUpdate(e: IEventTimestamped<Engine>) {
    super.onBeforeUpdate(e);
    this.characters.forEach((character) => {
      character.controlSpeed();
    });
  }
}
