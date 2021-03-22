import Matter, { Common } from 'matter-js';
import { CharacterController } from 'src/view/matter/controllers/characterController';
import { Character } from 'src/view/matter/actors/character';
import { CharacterFactory } from 'src/view/matter/actors/characterFactory';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';
import { MatterListAdapter } from 'src/view/matter/lib/matterListAdapter';

export class MatterController {

  constructor(
      public readonly engine: Matter.Engine,
      public readonly walls: Matter.Body[],
      public readonly button: Matter.Body,
      public readonly characterController: CharacterController,
      public readonly canvas: CanvasParameter,
  ) {
    // 重力を無効化する
    this.disableGravity();
    this.addObjects(this.walls);

    this.addObject(this.button);

    // マウス操作を可能にする
    const mouseConstraint = Matter.MouseConstraint.create(this.engine);
    Matter.World.add(this.engine.world, mouseConstraint);

    // すり抜けしないようにスピードを制限する (アップデート前)
    Matter.Events.on(this.engine, 'beforeUpdate', () => {
      const objects = Matter.Composite.allBodies(this.engine.world);
      const maxSpeed = 10;
      objects.forEach(object => {
        if (object.speed >= maxSpeed) {
          Matter.Body.setVelocity(object, Matter.Vector.mult(Matter.Vector.normalise(object.velocity), maxSpeed));
        }
        // console.log("objectSpeed: " + object.speed);
      });
    });

    // もしオブジェクトがクリックされたならば削除する
    Matter.Events.on(mouseConstraint, 'mousedown', (event) => {
      const clickObj = event.source.body;
      if (clickObj) {
        switch (clickObj.label) {
          case 'character':
            console.log(`Clicked ${clickObj.label} button.`);
            const clickCharacter = this.characterController.getCharacter(clickObj.id);
            if (clickCharacter) this.removeCharacter(clickCharacter);
            break;
          case 'addButton':
            console.log(`Clicked ${clickObj.label} button.`);
            const character = CharacterFactory.create(this.canvas, `${Common.nextId()}`, '新しく追加したオブジェクトです');
            this.addCharacter(character);
            break;
          default:
            console.log(`Clicked ${clickObj.label} button.`);
            break;
        }
      }
    });

    // 回転を防止
    Matter.Events.on(this.engine, 'beforeUpdate', () => {
      const characters = Array.from(this.characterController.characters.values());
      for (const character of characters) {
        Matter.Body.setAngularVelocity(character.object, 0);
      }
    });
  }

  /**エンジンを動かす */
  run() {
    Matter.Engine.run(this.engine);
  }

  /** 重力を無効にする */
  disableGravity() {
    this.engine.world.gravity.y = 0;
  }

  /**
   * ワールドにオブジェクトを追加（単体）
   * @param object {Matter.Body} 追加したいオブジェクト
   */
  addObject(object: Matter.Body): void {
    Matter.World.add(this.engine.world, object);
  }

  /**
   * ワールドにオブジェクトを追加（複数）
   * @param objects {Matter.Body[]} 追加したいオブジェクトの配列
   */
  addObjects(objects: Matter.Body[]): void {
    Matter.World.add(this.engine.world, objects);
  }

  /**
   * ワールドのオブジェクトを削除（単体）
   * @param object {Matter.Body} 削除したいオブジェクト
   */
  removeObject(object: Matter.Body): void {
    Matter.World.remove(this.engine.world, object);
  }

  /**
   * キャラクターをワールドに追加
   *  @param {Character} character 追加するキャラクター
   */
  addCharacter(character: Character): void {
    if (this.characterController.isIdCollision(character)) alert('Collision!');
    this.addObject(character.object);
    this.characterController.add(character);
  }

  /**
   * ワールドからキャラクターを削除
   * @param {Character} character
   */
  removeCharacter(character: Character): void {
    this.removeObject(character.object);
    this.characterController.removeByCharacter(character);
    this.characterController.show();
  }
}
