import { ActorParameter } from 'src/view/matter/types/actorParameter';

/**
 * {@link Actor}のパラメターを変更して、
 * キャラクターにアニメーション効果を付ける。
 */
export abstract class Animator<T extends ActorParameter> {
  private isStarted: boolean = false;

  private startAt: number = 0;

  /**
   * @param duration アニメーションにかかる時間(ミリ秒)
   * @param callback アニメーション開始、終了のタイミングで呼ばれるコールバック関数。
   */
  constructor(
    protected readonly duration: number,
    private readonly callback: {
      onStart?: () => void,
      onEnd?: () => void,
    },
  ) {
  }

  /**
   * 描画タイミングで、この関数を呼ぶと、
   * 経過時間に応じて、アニメーションを実行する。
   */
  animate(params: T): T {
    const { onStart, onEnd } = this.callback;
    if (!this.isStarted) {
      this.isStarted = true;
      this.startAt = Date.now();
      if (onStart) onStart();
    }

    const timeElapsed = Date.now() - this.startAt;
    if (timeElapsed > this.duration) {
      if (onEnd) onEnd();
      // アニメーション終了のタイミングでアニメーションを実行する。
      return this.onAnimate(params, this.duration);
    }
    return this.onAnimate(params, timeElapsed);
  }

  /**
   * アニメーションを実装するクラスは、この関数の中で、パラメータを変更する。
   * @param params パラメータを変更すると、CharacterDrawerが描画時に、そのパラメータに応じた描画を行う。
   * @param timeElapsed アニメーションを開始してからの経過時間(ミリ秒)
   */
  protected abstract onAnimate(params: T, timeElapsed: number): T;
}
