import { Vector } from 'matter-js';

type Bounds = {
  min?: Vector,
  max?: Vector,
}
/**
 * カメラが上下左右どれだけ移動するか等の状態を管理
 */
export class Camera {
  public offset: Vector;

  public bounds: Bounds|null;

  /**
   * @param offset カメラの移動量
   * @param bounds カメラの移動可能な範囲(片方の座標は無制限にしたいというときはInfinityを指定)
   */
  constructor({ offset, bounds }:{
    offset?: Vector,
    bounds?: Bounds
  }) {
    this.offset = offset ?? { x: 0, y: 0 };
    this.bounds = bounds ?? null;
  }

  move(x:number, y: number) {
    const [destX, destY] = [this.offset.x + x, this.offset.y + y];

    // 範囲外には動かさない
    const [minX, minY, maxX, maxY] = [
      this.bounds?.min?.x ?? -Infinity,
      this.bounds?.min?.y ?? -Infinity,
      this.bounds?.max?.x ?? Infinity,
      this.bounds?.max?.y ?? Infinity,
    ];
    if (destY >= minY && destY <= maxY) {
      this.offset.y = destY;
    }
    if (destX >= minX && destX <= maxX) {
      this.offset.x = destX;
    }
  }
}
