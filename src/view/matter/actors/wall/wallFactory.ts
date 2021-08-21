import { Wall } from 'src/view/matter/actors/wall/wall';
import { WallParams } from 'src/view/matter/actors/wall/wallParams';
import { Bodies } from 'matter-js';
import { v4 as uuidv4 } from 'uuid';
import { CanvasParameter } from 'src/view/matter/types/canvasParameter';
import { VerticalExpandWallController } from 'src/view/matter/controllers/wall/verticalExpandWallController';
import { Controller } from 'src/view/matter/types/controller';
import { HorizontalExpandWallController } from 'src/view/matter/controllers/wall/horizontalExpandWallController';
import { StickRightSideWallController } from 'src/view/matter/controllers/wall/stickRightSideWallController';

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
  controllers: Controller<WallParams>[],
}

export class WallFactory {
  static create({
    x, y,
    width, height,
    controllers,
  }: WallFactoryParams): Wall {
    // Matterのオブジェクトは中心位置からの縦、幅で決定する
    const body = Bodies.rectangle(x, y, width, height, { isStatic: true });
    const params = new WallParams({ body });
    return new Wall({ id: uuidv4(), params, controllers });
  }

  static createTopWall(canvas: CanvasParameter): Wall {
    const x = canvas.width / 2;
    const y = -WallParams.WALL_THICK / 2;
    const { width } = canvas;
    const height = WallParams.WALL_THICK;
    const controllers = [new HorizontalExpandWallController()];
    return WallFactory.create({ x, y, width, height, controllers });
  }

  static createLeftWall(): Wall {
    const x = -WallParams.WALL_THICK / 2;
    const y = VerticalExpandWallController.BASE_WALL_HEIGHT / 2;
    const width = WallParams.WALL_THICK;
    const height = VerticalExpandWallController.BASE_WALL_HEIGHT;
    const controllers = [new VerticalExpandWallController()];
    return WallFactory.create({ x, y, width, height, controllers });
  }

  static createRightWall(canvas: CanvasParameter): Wall {
    const x = canvas.width + WallParams.WALL_THICK;
    const y = VerticalExpandWallController.BASE_WALL_HEIGHT / 2;
    const width = WallParams.WALL_THICK;
    const height = VerticalExpandWallController.BASE_WALL_HEIGHT;
    const controllers = [new VerticalExpandWallController(), new StickRightSideWallController()];
    return WallFactory.create({ x, y, width, height, controllers });
  }
}
