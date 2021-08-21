/* eslint-disable no-param-reassign */
import { Controller } from 'src/view/matter/types/controller';
import P5Types from 'p5';
import { World } from 'src/view/matter/types/world';
import { CharacterPopoutAnimator } from 'src/view/matter/actors/character/animator/characterPopoutAnimator';
import { CharacterParams } from 'src/view/matter/actors/character/characterParams';
import { CharacterFadeoutAnimator } from 'src/view/matter/actors/character/animator/characterFadeoutAnimator';
import { Animator } from 'src/view/matter/types/animator';

const AnimatorKey = {
  POPOUT: 'POPOUT',
  FADEOUT: 'FADEOUT',
};

export class PopupCharacterController extends Controller<CharacterParams> {
  private readonly animators = new Map<string, Animator<CharacterParams>>();

  onStart(_: P5Types, world: World, actor: CharacterParams): CharacterParams {
    // ランダムな場所に配置
    const { width, height } = world.canvas;
    const xDirection = Math.random() < 0.5 ? 1 : -1;
    const yDirection = Math.random() < 0.5 ? 1 : -1;
    const x = width / 2 + width * 0.45 * Math.random() * xDirection;
    const y = height / 2 + height * 0.45 * Math.random() * yDirection;
    actor.position = { x, y };

    // 衝突を検知することで、キャラクター同士のかさなりを防ぐ。
    actor.collision = true;

    const animator = new CharacterPopoutAnimator(400, {
      onEnd: () => this.animators.delete(AnimatorKey.POPOUT),
    });
    this.animators.set(AnimatorKey.POPOUT, animator);

    return actor;
  }

  onUpdate(_: P5Types, __: World, actor: CharacterParams): CharacterParams {
    // 単振り子の動作をさせる
    actor.velocity = {
      x: 0,
      y: Math.sin(Date.now() / 1000 + actor.body.id) * 0.1,
    };

    this.animators.forEach((animator) => {
      actor = animator.animate(actor);
    });

    return actor;
  }

  onBeforeDestroy(_: P5Types, __: World, ___: CharacterParams, destroy: () => void) {
    // フェードアウトアニメーションを実行後、キャラクターを削除する。
    const animator = new CharacterFadeoutAnimator(400, {
      onEnd: () => {
        this.animators.delete(AnimatorKey.FADEOUT);
        destroy();
      },
    });
    this.animators.set(AnimatorKey.FADEOUT, animator);
  }
}
