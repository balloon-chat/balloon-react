import Matter, { Engine, Mouse, MouseConstraint } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/types/canvasParameter';
import { World } from 'src/view/matter/types/world';
import P5Types from 'p5';
import { WallFactory } from 'src/view/matter/actors/wall/wallFactory';
import { Wall } from 'src/view/matter/actors/wall/wall';

export class MatterWorld extends World {
  private readonly walls: Wall[]

  constructor(
    engine: Engine,
    canvas: CanvasParameter,
  ) {
    super(engine, canvas);
    // 重力を無効化する
    this.engine.world.gravity.x = 0;
    this.engine.world.gravity.y = 0;

    // 画面の下部以外に壁を配置
    this.walls = [
      WallFactory.createTopWall(canvas),
      WallFactory.createLeftWall(),
      WallFactory.createRightWall(canvas),
    ];
  }

  run(p5: P5Types) {
    super.run(p5);
    this.walls.forEach((wall) => this.addActor(p5, wall));
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
}
