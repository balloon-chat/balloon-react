import { Vector } from 'matter-js';

export interface CharacterAction {
  /**
   * キャラクターをランダムな方向、速度で移動
   */
  moveSomeWhere(): void;

  /**
   * キャラクターをフェードアウトする。
   * @param span フェードアウトが完了するまでにかかる時間(ミリ秒)
   * @param onFadeOuted フェードアウト完了時のコールバック関数
   */
  fadeout(span: number, onFadeOuted: ()=> void | undefined): void
}

export type EyePosition = {
  left: Vector,
  right: Vector,
};
