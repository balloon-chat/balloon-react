import { CharacterDrawer } from 'src/view/matter/actors/character/drawer/characterDrawer';

/**
 * CharacterDrawerのパラメターを変更して、
 * キャラクターにアニメーション効果を付ける。
 */
export abstract class CharacterAnimator {
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
   * P5などの描画タイミングで、この関数を呼ぶと、
   * 経過時間に応じて、アニメーションを実行する。
   */
  animate(drawer: CharacterDrawer) {
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
      this.onAnimate(drawer, this.duration);
      return;
    }
    this.onAnimate(drawer, timeElapsed);
  }

  /**
   * アニメーションを実装するクラスは、この関数の中で、パラメータを変更する。
   * @param drawer パラメータを変更すると、CharacterDrawerが描画時に、そのパラメータに応じた描画を行う。
   * @param timeElapsed アニメーションを開始してからの経過時間(ミリ秒)
   */
  protected abstract onAnimate(drawer: CharacterDrawer, timeElapsed: number): void;
}
