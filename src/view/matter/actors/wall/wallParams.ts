import { ActorParameter } from 'src/view/matter/types/actorParameter';
import { Body } from 'matter-js';

export class WallParams extends ActorParameter {
  // Actorが壁を通り抜けないように、壁に厚みを付ける
  // また、急に画面の大きさが変化したときに、壁の向こう側に取り残されないように、十分大きくする。
  public static readonly WALL_THICK = 2000;

  public static readonly BASE_WALL_HEIGHT = 2000;

  // trueの場合は壁を描画する
  public static readonly DEBUG = false;

  public height = WallParams.BASE_WALL_HEIGHT;

  constructor({ body }:{body: Body}) {
    super(body);
  }

  get width(): number {
    return this.body.bounds.max.x - this.body.bounds.min.x;
  }
}
