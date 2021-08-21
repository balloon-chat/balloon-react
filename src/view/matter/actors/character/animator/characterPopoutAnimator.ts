import { Animator } from 'src/view/matter/types/animator';
import { CharacterParams } from 'src/view/matter/actors/character/characterParams';

export class CharacterPopoutAnimator extends Animator<CharacterParams> {
  private static scale(x: number, duration: number, maxScale: number) {
    // 小数をある程度切り捨てる
    const rX: number = Math.round(x * 100) / 100;
    const rM: number = Math.round(maxScale * 10) / 10;
    const a: number = -(4 * rM - 4) / duration ** 2;
    const b: number = (4 * rM - 4) / duration;
    const c: number = 1;
    return a * rX ** 2 + b * rX + c;
  }

  protected onAnimate(params: CharacterParams, timeElapsed: number): CharacterParams {
    // eslint-disable-next-line no-param-reassign
    params.scale = CharacterPopoutAnimator.scale(timeElapsed, this.duration, 1.5);
    return params;
  }
}
