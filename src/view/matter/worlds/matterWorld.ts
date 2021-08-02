import Matter, { Engine, Mouse, MouseConstraint } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/types/canvasParameter';
import { World } from 'src/view/matter/types/world';

export class MatterWorld extends World {
  constructor(
    engine: Engine,
    canvas: CanvasParameter,
  ) {
    super(engine, canvas);
    // 重力を無効化する
    this.disableGravity();
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
}
