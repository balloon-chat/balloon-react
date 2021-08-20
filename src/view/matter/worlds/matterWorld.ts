import Matter, { Body, Engine, Mouse, MouseConstraint } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/types/canvasParameter';
import { World } from 'src/view/matter/types/world';
import P5Types from 'p5';
import { WallFactory } from 'src/view/matter/actors/wall/wallFactory';
import { WallParams } from 'src/view/matter/actors/wall/wallParams';
import { Actor } from 'src/view/matter/types/actor';
import { ExpandWallController } from 'src/view/matter/controllers/wall/expandWallController';

export class MatterWorld extends World {
  private readonly walls: {
    top: Actor<WallParams>,
    right: Actor<WallParams>,
    left: Actor<WallParams>
  }

  constructor(
    engine: Engine,
    canvas: CanvasParameter,
  ) {
    super(engine, canvas);
    // 重力を無効化する
    this.engine.world.gravity.x = 0;
    this.engine.world.gravity.y = 0;

    // 画面の下部以外に壁を配置
    this.walls = {
      top: WallFactory.create({
        x: canvas.width / 2,
        y: -WallParams.WALL_THICK / 2,
        width: canvas.width,
        height: WallParams.WALL_THICK,
      }),
      left: WallFactory.create({
        x: -WallParams.WALL_THICK / 2,
        y: WallParams.BASE_WALL_HEIGHT / 2,
        width: WallParams.WALL_THICK,
        height: WallParams.BASE_WALL_HEIGHT,
        controllers: [new ExpandWallController()],
      }),
      right: WallFactory.create({
        x: canvas.width + WallParams.WALL_THICK,
        y: WallParams.BASE_WALL_HEIGHT / 2,
        width: WallParams.WALL_THICK,
        height: WallParams.BASE_WALL_HEIGHT,
        controllers: [new ExpandWallController()],
      }),
    };
  }

  run(p5: P5Types) {
    super.run(p5);
    Object.values(this.walls).forEach((wall) => this.addActor(p5, wall));
  }

  /**
   * マウスイベントをハンドラを付与
   * @param element 指定されたHTMLエレメント内のみ、マウスイベントを処理する
   */
  setMouseEventHandler(element: HTMLElement) {
    const mouse = Mouse.create(element);
    const mouseConstraint = MouseConstraint.create(this.engine, { mouse });
    Matter.World.add(this.engine.world, mouseConstraint);
    super.mouse = mouse;
  }

  resizeCanvas(width: number, height: number) {
    const prevWidth = this.canvas.width;
    const { top, right } = this.walls;

    // TODO: HorizontalWall等を作成して、その中で行う
    // 上部の壁の幅を画面幅いっぱいにする
    Body.translate(top.body, { x: (width - prevWidth) / 2, y: 0 });
    Body.scale(top.body, width / prevWidth, 1);

    // 右の壁の位置を画面の右端に移動
    const wallThick = WallParams.WALL_THICK;
    Body.setPosition(right.body, { x: width + wallThick / 2, y: right.position.y });

    super.resizeCanvas(width, height);
  }
}
