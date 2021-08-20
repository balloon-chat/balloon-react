import { Wall } from 'src/view/matter/actors/wall/wall';
import { WallParams } from 'src/view/matter/actors/wall/wallParams';
import { Bodies } from 'matter-js';
import { v4 as uuidv4 } from 'uuid';
import { VerticalWall } from 'src/view/matter/actors/wall/verticalWall';
import { CanvasParameter } from 'src/view/matter/types/canvasParameter';

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
}

export class WallFactory {
  static create({
    x, y,
    width, height,
  }: WallFactoryParams): Wall {
    // Matterのオブジェクトは中心位置からの縦、幅で決定する
    const body = Bodies.rectangle(x, y, width, height, { isStatic: true });
    const params = new WallParams({ body });
    return new Wall({ id: uuidv4(), params, controllers: [] });
  }

  static createVerticalWall({
    x, y,
    width, height,
  }: WallFactoryParams): VerticalWall {
    const body = Bodies.rectangle(x, y, width, height, { isStatic: true });
    const params = new WallParams({ body });
    return new VerticalWall({ id: uuidv4(), params });
  }

  static createTopWall(canvas: CanvasParameter): Wall {
    const x = canvas.width / 2;
    const y = -WallParams.WALL_THICK / 2;
    const { width } = canvas;
    const height = WallParams.WALL_THICK;
    return WallFactory.create({ x, y, width, height });
  }

  static createLeftWall(): VerticalWall {
    const x = -WallParams.WALL_THICK / 2;
    const y = WallParams.BASE_WALL_HEIGHT / 2;
    const width = WallParams.WALL_THICK;
    const height = WallParams.BASE_WALL_HEIGHT;
    return WallFactory.createVerticalWall({ x, y, width, height });
  }

  static createRightWall(canvas: CanvasParameter): VerticalWall {
    const x = canvas.width + WallParams.WALL_THICK;
    const y = WallParams.BASE_WALL_HEIGHT / 2;
    const width = WallParams.WALL_THICK;
    const height = WallParams.BASE_WALL_HEIGHT;
    return WallFactory.createVerticalWall({ x, y, width, height });
  }
}
