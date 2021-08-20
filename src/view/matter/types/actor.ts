import P5Types from 'p5';
import Matter from 'matter-js';
import { Controller } from 'src/view/matter/types/controller';
import { World } from 'src/view/matter/types/world';
import { ActorParameter } from 'src/view/matter/types/actorParameter';

export const ActorTags = {
  CHARACTER: 'CHARACTER',
  WALL: 'WALL',
};
export type ActorTag = typeof ActorTags[keyof typeof ActorTags];

/**
 * {@link World}に追加されるオブジェクト
 * {@link ActorParameter}により振る舞いが決まり、
 * {@link Controller}によってそれを変化させる。
 */
export abstract class Actor<T extends ActorParameter> {
  /**
   * @param id Actorを識別するためのユニークなID
   * @param tag Actorをグループ化するタグ
   * @param params controllerが操作するパラメータ
   * @param controllers Actorの動作を定義するスクリプト
   */
  protected constructor(
    public readonly id: number|string,
    public readonly tag: ActorTag,
    public params: T,
    public readonly controllers: Controller<T>[],
  ) {
  }

  get body() {
    return this.params.body;
  }

  get position() {
    return this.params.body.position;
  }

  /**
   * 描画の開始前に実行される
   */
  start(p5: P5Types, world: World) {
    this.controllers.forEach((c) => {
      this.params = c.onStart(p5, world, this.params);
    });
    Matter.World.add(world.matterWorld, this.params.body);
  }

  /**
   * 描画の更新中に実行される
   */
  update(p5: P5Types, world: World) : void {
    this.controllers.forEach((c) => {
      this.params = c.onUpdate(p5, world, this.params);
    });
  }

  /**
   * {@link Actor}の削除処理を行う。
   * {@link Controller#onBeforeDestroy}をすべて実行した後に、{@link onDestroy}を実行する。
   * @param p5
   * @param world
   * @param immediately trueの場合、Controllerの処理を待たずに、今すぐ削除処理を実行
   * @param onDestroy
   */
  destroy(
    p5: P5Types,
    world: World,
    { immediately = false, onDestroy }: {
      immediately?: boolean,
      onDestroy: () => void
    },
  ): void {
    if (immediately) {
      this.controllers.forEach((c) => {
        c.onBeforeDestroy(p5, world, this.params, () => {});
      });
      onDestroy();
      console.info('ACTOR is destroyed', this);
      return;
    }

    let count = 0; // 何回コールバックが呼ばれたかを記録
    const destroy = () => {
      count += 1;

      // すべてのコントローラーでコールバックが呼ばれたときに実行
      if (count === this.controllers.length) {
        onDestroy();
        console.info('ACTOR is destroyed', this);
      }
    };

    this.controllers.forEach((c) => {
      c.onBeforeDestroy(p5, world, this.params, destroy);
    });
  }
}
