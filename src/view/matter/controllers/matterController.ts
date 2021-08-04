import { Engine, Events, Mouse, MouseConstraint, Runner, World } from 'matter-js';
import { CharacterController } from 'src/view/matter/controllers/characterController';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';
import { MatterListAdapter } from 'src/view/matter/lib/matterListAdapter';
import P5Types from 'p5';
import { mediaQuery } from 'src/components/constants/mediaQuery';

export class MatterController {
  public readonly adapter: MatterListAdapter;

  public p5: P5Types | null = null;

  private runner: Runner | null = null;

  constructor(
    public readonly engine: Engine,
    public readonly character: CharacterController,
    public readonly canvas: CanvasParameter,
  ) {
    this.adapter = new MatterListAdapter(this);

    // 重力を無効化する
    this.disableGravity();

    // characterのアップデート前に行う動作
    Events.on(this.engine, 'beforeUpdate', (e) => {
      this.character.onBeforeUpdate(e);
    });
  }

  get world(): World {
    return this.engine.world;
  }

  get isMobile(): boolean {
    return this.canvas.width <= mediaQuery.mobile.landscape;
  }

  run() {
    this.runner = Runner.run(this.engine);
  }

  clear() {
    if (this.runner) Runner.stop(this.runner);
    this.adapter.submit([]);
  }

  draw(p5: P5Types) {
    this.character.draw(p5);
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
    const options = { mouse };
    const mouseConstraint = MouseConstraint.create(this.engine, options);
    mouseConstraint.constraint.stiffness = 1.0; // ドラッグ時にバネの挙動をさせない
    World.add(this.engine.world, mouseConstraint);
  }
}
