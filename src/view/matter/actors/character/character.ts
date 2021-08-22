import { World } from 'src/view/matter/types/core/world';
import P5Types from 'p5';
import { CharacterDrawer } from 'src/view/matter/actors/character/characterDrawer';
import { Actor, ActorTags } from 'src/view/matter/types/core/actor';
import { Controller } from 'src/view/matter/types/core/controller';
import { CharacterParams } from 'src/view/matter/actors/character/characterParams';
import Matter from 'matter-js';

export class Character extends Actor<CharacterParams> {
  private static lastAddedAt = 0;

  readonly drawer = new CharacterDrawer();

  /**
   * キャラクター（オブジェクトとテキストの情報を持っている）
   *  @param id 識別用文字列
   *  @param params キャラクターが持つ情報
   *  @param controllers キャラクターの振る舞いを決めるController
   */
  constructor(
    readonly id: string,
    public params: CharacterParams,
    controllers: Controller<CharacterParams>[],
  ) {
    super(id, ActorTags.CHARACTER, params, controllers);
  }

  start(p5: P5Types, world: World) {
    super.start(p5, world);

    const current = Date.now();
    if (current - Character.lastAddedAt > 400) {
      // TODO: 送信音の有無の設定ができるようにする。
      const audio = new Audio('/sound/popup.mp3');
      audio.play().catch((e) => {
        console.error(e);
      });
      Character.lastAddedAt = current;
    }
  }

  update(p5: P5Types, world: World) {
    super.update(p5, world);
    // 回転をさせない
    Matter.Body.setAngularVelocity(this.params.body, 0);
    this.params = this.drawer.draw(this.params, p5, world);
  }
}
