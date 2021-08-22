/* eslint-disable class-methods-use-this */
import { Controller } from 'src/view/matter/types/core/controller';
import { WallParams } from 'src/view/matter/actors/wall/wallParams';
import P5Types from 'p5';
import { World } from 'src/view/matter/types/core/world';
import { ActorTags } from 'src/view/matter/types/core/actor';
import { Body } from 'matter-js';

/**
 * {@link Actor}が必ず壁にあたって跳ね返るように、
 * 高さを調整する。
 */
export class VerticalExpandWallController extends Controller<WallParams> {
  public static readonly BASE_WALL_HEIGHT = 2000;

  onStart(_p5: P5Types, _world: World, actor: WallParams): WallParams {
    return actor;
  }

  onUpdate(_p5: P5Types, world: World, actor: WallParams): WallParams {
    // 壁以外のアクターを取得
    const actors = world.actors
      .filter((actor) => actor.tag !== ActorTags.WALL);
    if (actors.length === 0) return actor;

    // 最も深い場所にいるアクターを取得
    const bottomActor = actors
      .reduce((a, b) => (a.body.bounds.max.y > b.body.bounds.max.y ? a : b));
    if (!bottomActor) return actor;

    // 壁の高さが十分であれば何もしない
    if (bottomActor.body.bounds.max.y < actor.height) return actor;

    // 壁の高さを一段階(BASE_WALL_HEIGHT)分、高くする。
    const { body } = actor;
    const prevHeight = actor.height;
    const newHeight = actor.height + VerticalExpandWallController.BASE_WALL_HEIGHT;
    Body.translate(body, { x: 0, y: (newHeight - prevHeight) / 2 });
    Body.scale(body, 1, newHeight / prevHeight);

    // eslint-disable-next-line no-param-reassign
    actor.height = newHeight;

    return actor;
  }
}
