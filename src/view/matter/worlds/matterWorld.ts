import Matter, { Bodies, Body, Engine, Mouse, MouseConstraint } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/types/canvasParameter';
import { World } from 'src/view/matter/types/world';

export class MatterWorld extends World {
  private readonly walls: {top: Body, right: Body, left: Body};

  constructor(
    engine: Engine,
    canvas: CanvasParameter,
  ) {
    super(engine, canvas);
    // 重力を無効化する
    this.disableGravity();

    const wallTop = Bodies.rectangle(
      canvas.width / 2, 0,
      canvas.width, 1,
      { isStatic: true },
    );
    const wallLeft = Bodies.rectangle(
      0, canvas.height / 2,
      1, canvas.height,
      { isStatic: true },
    );
    const wallRight = Bodies.rectangle(
      canvas.width, canvas.height / 2,
      1, canvas.height,
      { isStatic: true },
    );
    this.walls = {
      top: wallTop,
      left: wallLeft,
      right: wallRight,
    };
    Object.values(this.walls).forEach((wall) => Matter.World.add(this.matterWorld, wall));
  }

  private disableGravity() {
    this.engine.world.gravity.x = 0;
    this.engine.world.gravity.y = 0;
  }

  /**
   * マウスイベントをハンドラを付与
   * @param element 指定されたHTMLエレメント内のみ、マウスイベントを処理する
   */
  setMouseEventHandler(element: HTMLElement) {
    const mouse = Mouse.create(element);
    const mouseConstraint = MouseConstraint.create(this.engine, { mouse });
    Matter.World.add(this.engine.world, mouseConstraint);
  }

  resizeCanvas(width: number, height: number) {
    const prevWidth = this.canvas.width;
    const { top, right } = this.walls;

    // 上部の壁の幅を画面幅いっぱいにする
    Body.translate(top, { x: (width - prevWidth) / 2, y: 0 });
    Body.scale(top, width / prevWidth, 1);

    // 右の壁の位置を画面の右端に移動
    Body.setPosition(right, { x: width, y: right.position.y });

    super.resizeCanvas(width, height);
  }
}
