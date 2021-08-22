import { Animator } from 'src/view/matter/types/util/animator';
import { CharacterParams } from 'src/view/matter/actors/character/characterParams';

export class CharacterFadeoutAnimator extends Animator<CharacterParams> {
  protected onAnimate(params: CharacterParams, timeElapsed: number): CharacterParams {
    // eslint-disable-next-line no-param-reassign
    params.opacity = 1 - (timeElapsed / this.duration);
    return params;
  }
}
