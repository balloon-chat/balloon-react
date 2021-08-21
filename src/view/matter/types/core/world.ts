/* eslint-disable class-methods-use-this */
import Matter, { Engine, Mouse, Runner } from 'matter-js';
import P5Types from 'p5';
import { Actor } from 'src/view/matter/types/core/actor';
import { CanvasParameter } from 'src/view/matter/types/util/canvasParameter';
import { Camera } from 'src/view/matter/types/util/camera';

/**
 * すべてのActorを管理するオブジェクト
 * P5の描画イベントに応じで、Actorの描画イベントを発火するなど制御を行う。
 */
export abstract class World {
  public p5: P5Types | null = null;

  private runner: Runner|null = null;

  public abstract readonly camera: Camera;

  protected mouse: Mouse|null = null;

  protected constructor(
    public readonly engine: Engine,
    public readonly canvas: CanvasParameter,
  ) {
  }

  /**
   * 画面に描画されるすべてのオブジェクト
   */
  private _actors: Actor<any>[] = []

  get actors() {
    return this._actors;
  }

  get matterWorld(): Matter.World {
    return this.engine.world;
  }

  // =================
  // Start
  // =================
  /**
   * 物理演算を開始
   */
  start(p5: P5Types) {
    this.p5 = p5;
    this.runner = Runner.run(this.engine);
    console.info('RUN');
  }

  /**
   * 画面の再描画
   */
  update(p5: P5Types) {
    this.beforeUpdate(p5);
    Promise
      .all(this.actors.map((actor) => actor.update(p5, this)))
      .then();
    this.afterUpdate(p5);
  }

  /**
   * Worldの状態をリセットする
   */
  destroy() {
    this.beforeDestroy();

    if (this.runner) Runner.stop(this.runner);
    this._actors.forEach((actor) => {
      this.removeActor(actor, true);
    });

    this.afterDestroy();

    console.info('CLEAR');
  }

  // =================
  // Update
  // =================

  /**
   * ActorをIDによって検索する
   */
  findById(id: string): Actor<any> | null {
    return this._actors.find((actor) => actor.id === id) ?? null;
  }

  // @ts-ignore
  protected beforeStart(p5: P5Types) {}

  // @ts-ignore
  protected afterStart(p5: P5Types) {}

  // =================
  // Destroy
  // =================

  // @ts-ignore
  protected beforeUpdate(p5: P5Types) {
    this.updateCamera(p5, this.camera);
  }

  // @ts-ignore
  protected afterUpdate(p5: P5Types) {}

  protected beforeDestroy() {}

  /**
   * カメラ位置の更新
   */
  private updateCamera(p5:P5Types, camera: Camera) {
    // キャンバスのズレと、マウスのクリック位置を対応付ける
    const canvasOffset = {
      x: camera.offset.x,
      y: camera.offset.y,
    };
    if (this.mouse) Mouse.setOffset(this.mouse, canvasOffset);

    // Actorの位置をカメラの位置と対応するようにずらす
    p5.translate(-camera.offset.x, -camera.offset.y);
  }

  protected afterDestroy() {}

  addActor(p5: P5Types, actor: Actor<any>) {
    actor.start(p5, this);
    this._actors.push(actor);
  }

  removeActor(actor: Actor<any>, immediately?: boolean) {
    if (!this.p5) return;

    actor.destroy(this.p5, this, {
      immediately,
      onDestroy: () => {
        Matter.World.remove(this.matterWorld, actor.body);
        this._actors = this._actors.filter((a) => a.id !== actor.id);
      },
    });
  }

  resizeCanvas(width: number, height: number) {
    this.canvas.setSize(width, height);
  }
}
