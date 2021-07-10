import { CharacterAnimator } from 'src/view/matter/actors/character/animator/characterAnimator';
import { CharacterDrawer } from 'src/view/matter/actors/character/drawer/characterDrawer';

export class CharacterFadeoutAnimator extends CharacterAnimator {
  protected onAnimate(drawer: CharacterDrawer, timeElapsed: number) {
    // eslint-disable-next-line no-param-reassign
    drawer.opacity = 1 - (timeElapsed / this.duration);
  }
}
