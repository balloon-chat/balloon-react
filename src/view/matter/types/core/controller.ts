/* eslint-disable class-methods-use-this */
import P5Types from 'p5';
import { World } from 'src/view/matter/types/core/world';
import { ActorParameter } from 'src/view/matter/types/util/actorParameter';

/**
 * {@link Actor}の振る舞いを変化させる
 */
export abstract class Controller<T extends ActorParameter> {
  abstract onStart(p5: P5Types, world: World, actor: T): T

  abstract onUpdate(p5: P5Types, world: World, actor: T): T

  // @ts-ignore
  onBeforeDestroy(p5: P5Types, world: World, actor: T, destroy: () => void) {
    destroy();
  }

  // @ts-ignore
  onAfterDestroy(p5: P5Types, world: World, actor: T) {}
}
