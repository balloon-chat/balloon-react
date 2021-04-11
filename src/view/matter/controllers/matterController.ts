/* eslint-disable no-param-reassign */
import Matter, { Vector } from 'matter-js';
import { CharacterController } from 'src/view/matter/controllers/characterController';
import { Character } from 'src/view/matter/actors/character';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';
import { MatterListAdapter } from 'src/view/matter/lib/matterListAdapter';
import P5Types from 'p5';
import { Button } from '../actors/button';

export class MatterController {
  public readonly adapter: MatterListAdapter;

  public readonly buttons: Button[];

  public p5: P5Types | null = null;

  constructor(
    public readonly engine: Matter.Engine,
    buttons: Button[],
    public readonly characterController: CharacterController,
    public readonly canvas: CanvasParameter,
  ) {
    this.adapter = new MatterListAdapter(this);
    // 重力を無効化する
    this.disableGravity();

    // ボタンをワールドに追加
    this.buttons = buttons;
    this.buttons.forEach((button) => {
      this.addObject(button.object);
    });

    // マウス操作を可能にする
    const mouseConstraint = Matter.MouseConstraint.create(this.engine);
    Matter.World.add(this.engine.world, mouseConstraint);

    // characterのアップデート前に行う動作（スピード調整等）
    Matter.Events.on(this.engine, 'beforeUpdate', () => {
      const characters = Array.from(
        this.characterController.characters.values(),
      );
      characters.forEach((character) => character.beforeUpdateOnMatter(this));
    });
  }

  /** エンジンを動かす */
  run() {
    Matter.Engine.run(this.engine);
  }

  /**
   * キャラクターをワールドに追加
   */
  addCharacter(character: Character): void {
    this.addObject(character.object);
    this.characterController.add(character);
    const sign = {
      x: Math.random() < 0.5 ? -1 : 1,
      y: Math.random() < 0.5 ? -1 : 1,
    };
    const velocity: Vector = Vector.mult(
      Matter.Vector.normalise({
        x: sign.x * Math.random(),
        y: sign.y * Math.random(),
      }),
      character.maxSpeed * Math.random(),
    );
    Matter.Body.setVelocity(character.object, velocity);
  }

  /**
   * ワールドからキャラクターを削除
   */
  removeCharacter(character: Character): void {
    this.removeObject(character.object);
    this.characterController.remove(character);
    this.characterController.inspect();
  }

  /** 重力を無効にする */
  private disableGravity() {
    this.engine.world.gravity.x = 0;
    this.engine.world.gravity.y = 0;
  }

  /**
   * ワールドにオブジェクトを追加（単体）
   * @param object {Matter.Body} 追加したいオブジェクト
   */
  private addObject(object: Matter.Body): void {
    Matter.World.add(this.engine.world, object);
  }

  /**
   * ワールドにオブジェクトを追加（複数）
   * @param objects {Matter.Body[]} 追加したいオブジェクトの配列
   */
  // private addObjects(objects: Matter.Body[]): void {
  //   Matter.World.add(this.engine.world, objects);
  // }

  /**
   * ワールドのオブジェクトを削除（単体）
   * @param object {Matter.Body} 削除したいオブジェクト
   */
  private removeObject(object: Matter.Body): void {
    Matter.World.remove(this.engine.world, object);
  }
}
