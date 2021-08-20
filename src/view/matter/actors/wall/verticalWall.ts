import { ActorTags } from 'src/view/matter/types/actor';
import { WallParams } from 'src/view/matter/actors/wall/wallParams';
import { Body } from 'matter-js';
import { World } from 'src/view/matter/types/world';
import P5Types from 'p5';
import { Wall } from 'src/view/matter/actors/wall/wall';

export class VerticalWall extends Wall {
  constructor({ id, params }: {id: string, params: WallParams}) {
    super({ id, params, controllers: [] });
  }

  update(p5: P5Types, world: World) {
    // 壁以外のアクターを取得
    const actors = world.actors
      .filter((actor) => actor.tag !== ActorTags.WALL);
    if (actors.length === 0) return;

    // 最も深い場所にいるアクターを取得
    const bottomActor = actors
      .reduce((a, b) => (a.body.bounds.max.y > b.body.bounds.max.y ? a : b));
    if (!bottomActor) {
      super.update(p5, world);
      return;
    }

    // 壁の高さが十分であれば何もしない
    if (bottomActor.body.bounds.max.y < this.params.height) {
      super.update(p5, world);
      return;
    }

    // 壁の高さを一段階(BASE_WALL_HEIGHT)分、高くする。
    const { body } = this.params;
    const prevHeight = this.params.height;
    const height = this.params.height + WallParams.BASE_WALL_HEIGHT;
    Body.translate(body, { x: 0, y: (height - prevHeight) / 2 });
    Body.scale(body, 1, height / prevHeight);

    this.params.height = height;

    super.update(p5, world);
  }
}
