import { Vector } from 'matter-js';

export interface CharacterAction {
  /**
   * キャラクターをランダムな方向、速度で移動
   */
  moveSomeWhere(): void;
}

export type EyePosition = {
  left: Vector,
  right: Vector,
};
