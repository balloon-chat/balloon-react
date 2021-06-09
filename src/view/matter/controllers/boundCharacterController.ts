import { Character } from 'src/view/matter/actors/character/character';
import { CharacterController } from 'src/view/matter/controllers/characterController';

export class BoundCharacterController extends CharacterController {
  add(character: Character) {
    super.add(character);
    character.moveSomeWhere();
  }

  remove(character: Character) {
    this._characters.delete(character.id);
  }

  onBeforeUpdate() {
    this.characters.forEach((character) => character.onBeforeUpdate());
  }
}
