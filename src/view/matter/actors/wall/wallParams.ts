import { ActorParameter } from 'src/view/matter/types/actorParameter';
import { Body } from 'matter-js';

export class WallParams extends ActorParameter {
  // Actorが壁を通り抜けないように、壁に厚みを付ける
  // また、急に画面の大きさが変化したときに、壁の向こう側に取り残されないように、十分大きくする。
  public static readonly WALL_THICK = 2000;

  // trueの場合は壁を描画する
  public static readonly DEBUG = false;

  public width: number;

  public height: number;

  constructor({ body }:{body: Body}) {
    super(body);
    this.height = body.bounds.max.y - body.bounds.min.y;
    this.width = body.bounds.max.x - body.bounds.min.x;
  }
}
