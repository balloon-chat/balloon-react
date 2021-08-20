/* eslint-disable class-methods-use-this */
import { Controller } from 'src/view/matter/types/controller';
import P5Types from 'p5';
import { ActorTags } from 'src/view/matter/types/actor';
import { WallParams } from 'src/view/matter/actors/wall/wallParams';
import { World } from 'src/view/matter/types/world';
import { Body } from 'matter-js';

/**
 * 壁の高さを最も下にいるActorよりも高くなるように、
 * 自動的に高さを調整するコントローラー
 */
export class ExpandWallController extends Controller<WallParams> {
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
    const prevHeight = actor.height;
    const height = actor.height + WallParams.BASE_WALL_HEIGHT;
    Body.translate(actor.body, { x: 0, y: (height - prevHeight) / 2 });
    Body.scale(actor.body, 1, height / prevHeight);

    // eslint-disable-next-line no-param-reassign
    actor.height = height;

    return actor;
  }
}
