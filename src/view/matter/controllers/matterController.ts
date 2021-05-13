import { Body, Engine, Events, Mouse, MouseConstraint, World } from 'matter-js';
import { CharacterController } from 'src/view/matter/controllers/characterController';
import { Character } from 'src/view/matter/actors/character/character';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';
import { MatterListAdapter } from 'src/view/matter/lib/matterListAdapter';
import P5Types from 'p5';
import { Button } from 'src/view/matter/actors/button/button';

export class MatterController {
  public readonly adapter: MatterListAdapter;

  public p5: P5Types | null = null;

  constructor(
    public readonly engine: Engine,
    public readonly buttons: Button[],
    public readonly characterController: CharacterController,
    public readonly canvas: CanvasParameter,
  ) {
    this.adapter = new MatterListAdapter(this);

    // 重力を無効化する
    this.disableGravity();
    this.engine.timing.timeScale = 0.01;
    // ボタンをワールドに追加
    this.buttons = buttons;
    this.buttons.forEach((button) => this.addObject(button.object));

    // characterのアップデート前に行う動作
    Events.on(this.engine, 'beforeUpdate', () => {
      // eslint-disable-next-line max-len
      const latestCharacter = this.characterController.getCharacter(this.characterController.latestCharacterId);
      if (typeof latestCharacter !== 'undefined') {
        // eslint-disable-next-line max-len
        Body.setPosition(latestCharacter.object, this.characterController.latestCharacterPosition);
      }
      const { characters } = this.characterController;
      characters.forEach((character) => character.onBeforeUpdate());
    });
  }

  /** エンジンを動かす */
  run() {
    Engine.run(this.engine);
  }

  /**
   * キャラクターをワールドに追加
   */
  addCharacter(character: Character): void {
    const sign = {
      x: Math.random() < 0.5 ? -1 : 1,
      y: Math.random() < 0.5 ? -1 : 1,
    };

    this.characterController.latestCharacterPosition = {
      x: this.canvas.center.x + sign.x * 50 * Math.random(),
      y: this.canvas.center.y + sign.y * 50 * Math.random(),
    };

    console.log(this.characterController.latestCharacterPosition);
    this.characterController.latestCharacterId = character.id;
    this.addObject(character.object);
    this.characterController.add(character);
  }

  /**
   * ワールドからキャラクターを削除
   */
  removeCharacter(character: Character): void {
    this.removeObject(character.object);
    this.characterController.remove(character);
  }

  /**
   * 重力を無効にする
    */
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

  private addObject(object: Body): void {
    World.add(this.engine.world, object);
  }

  /**
   * ワールドのオブジェクトを削除（単体）
   * @param object {Matter.Body} 削除したいオブジェクト
   */
  private removeObject(object: Body): void {
    World.remove(this.engine.world, object);
  }
}
