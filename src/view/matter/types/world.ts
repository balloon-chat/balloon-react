import Matter, { Engine, Runner } from 'matter-js';
import P5Types from 'p5';
import { Actor } from 'src/view/matter/types/actor';
import { CanvasParameter } from 'src/view/matter/types/canvasParameter';

/**
 * すべてのActorを管理するオブジェクト
 * P5の描画イベントに応じで、Actorの描画イベントを発火するなど制御を行う。
 */
export abstract class World {
  public p5: P5Types | null = null;

  private runner: Runner|null = null;

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

  /**
   * 物理演算を開始
   */
  run() {
    this.runner = Runner.run(this.engine);
    console.info('RUN');
  }

  /**
   * Worldの状態をリセットする
   */
  clear() {
    if (this.runner) Runner.stop(this.runner);
    this._actors.forEach((actor) => {
      this.removeActor(actor, true);
    });
    console.info('CLEAR');
  }

  /**
   * ActorをIDによって検索する
   */
  findById(id: string): Actor<any> | null {
    return this._actors.find((actor) => actor.id === id) ?? null;
  }

  /**
   * 画面の再描画
   */
  update(p5: P5Types) {
    Promise
      .all(this.actors.map((actor) => actor.update(p5, this)))
      .then();
  }

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
}
