import Matter, { Common } from 'matter-js';
import P5Types from 'p5';
import { MatterController } from 'src/view/matter/controllers/matterController';
import { buttonType } from 'src/view/matter/actors/buttonFactory';
import { CharacterFactory } from 'src/view/matter/actors/characterFactory';

export class Button {
    private readonly _object: Matter.Body;

    public static radius = 50;

    constructor(
      readonly x: number,
      readonly y: number,
      readonly type: buttonType,
      readonly color: string,
    ) {
      this._object = Matter.Bodies.circle(x, y, Button.radius, {
        friction: 1,
        isStatic: true,
        label: type,
        collisionFilter: {
          group: 0,
          category: 0x0004,
          mask: 0x0004 | 0x0001,
        } });
    }

    get object() {
      return this._object;
    }

    /** マウスがクリックされたときに行われる関数
     * @param matterController
     * @param mouseX
     * @param mouseY
     * @returns
     */
    mousePressed(matterController: MatterController, mouseX: number, mouseY: number) {
      if (this.isClicked(mouseX, mouseY) === false) return;
      switch (this.type) {
        case buttonType.add: {
          this.add(matterController);
          break;
        }
        case buttonType.removeAll: {
          this.removeAll(matterController);
          break;
        }
        case buttonType.shakeAll: {
          this.shakeAll(matterController);
          break;
        }
        default: {
          break;
        }
      }
    }

    /** 画面上にキャラクターを表示
     * @param matterController
     */
    add(matterController: MatterController) {
      if (matterController.p5 === null) return;
      const character = CharacterFactory.create(
        matterController.p5,
        matterController.canvas,
        `${Common.nextId()}`,
        '新しく追加したオブジェクトです',
      );
      matterController.addCharacter(character);
    }

    /** 画面上のすべてのキャラクターを消去
     * @param matterController
     */
    removeAll(matterController: MatterController) {
      const { characters } = matterController.characterController;
      characters.forEach((character) => matterController.removeCharacter(character));
    }

    /** 画面上のすべてのキャラクターを揺らす
     * @param matterController
     */
    shakeAll(matterController: MatterController) {
      const { characters } = matterController.characterController;
      characters.forEach((character) => character.moveSomeWhere());
    }

    isClicked(mouseX: number, mouseY: number) {
      const dist = (mouseX - this.object.position.x) ** 2 + (mouseY - this.object.position.y) ** 2;
      return dist < Button.radius ** 2;
    }

    draw(p5: P5Types) {
      p5.push();
      p5.fill(this.color)
        .noStroke()
        .circle(this.object.position.x, this.object.position.y, Button.radius * 2);
      p5.pop();
    }
}
