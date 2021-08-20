import { Wall } from 'src/view/matter/actors/wall/wall';
import { WallParams } from 'src/view/matter/actors/wall/wallParams';
import { Bodies } from 'matter-js';
import { Controller } from 'src/view/matter/types/controller';
import { v4 as uuidv4 } from 'uuid';

/**
 * @param x 壁の中心のX座標
 * @param y 壁の中心のY座標
 * @param width 壁の横幅
 * @param height 壁の縦幅
 */
type WallFactoryParams = {
  x: number,
  y: number,
  width: number,
  height: number,
  controllers?: Controller<WallParams>[]
}

export class WallFactory {
  static create({
    x, y,
    width, height,
    controllers = [],
  }: WallFactoryParams): Wall {
    // Matterのオブジェクトは中心位置からの縦、幅で決定する
    const body = Bodies.rectangle(x, y, width, height, { isStatic: true });
    const params = new WallParams({ body });
    return new Wall({ id: uuidv4(), params, controllers });
  }
}
