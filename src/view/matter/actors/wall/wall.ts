import { Actor, ActorTags } from 'src/view/matter/types/actor';
import { World } from 'src/view/matter/types/world';
import P5Types from 'p5';
import { WallParams } from 'src/view/matter/actors/wall/wallParams';
import { Controller } from 'src/view/matter/types/controller';

export class Wall extends Actor<WallParams> {
  constructor({
    id, params, controllers,
  }: {id: string, params: WallParams, controllers: Controller<WallParams>[]}) {
    super(id, ActorTags.WALL, params, controllers);
  }

  update(p5: P5Types, world: World) {
    super.update(p5, world);

    if (WallParams.DEBUG) {
      const { x, y } = this.position;
      const { width, height } = this.params;
      // 画面側面にくっついて見ることができないため、少しずらして描画する
      p5.push();
      p5
        .fill('orange')
        .rect(
          x - width / 2 - 25,
          y - height / 2 - 25,
          width + 50,
          height + 50,
        );
      p5.pop();
    }
  }
}
