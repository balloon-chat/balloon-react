import { Character } from 'src/view/matter/actors/character/character';
import { CharacterController } from 'src/view/matter/controllers/characterController';
import { World } from 'matter-js';

export class BoundCharacterController extends CharacterController {
  add(world: World, character: Character) {
    character.moveSomeWhere();
    super.add(world, character);
  }

  onBeforeUpdate() {
    super.onBeforeUpdate();
    this.characters.forEach((character) => {
      character.controlSpeed();
    });
  }
}
