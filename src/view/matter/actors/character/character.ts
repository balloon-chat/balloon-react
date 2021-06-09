import Matter, { Body, Common, Vector } from 'matter-js';
import P5Types from 'p5';
import { CharacterAction } from 'src/view/matter/actors/character/types';
import { CharacterDrawer } from 'src/view/matter/actors/character/characterDrawer';

/**
 * キャラクター（オブジェクトとテキストの情報を持っている）
 *  @param {Body} object オブジェクトデータ
 *  @param {string} text テキストデータ
 *  @param {string} id 識別用文字列
 *  @param {number} radius 半径
 *  @param {string} color 色
 */
export class Character implements CharacterAction {
  public static readonly maxSpeed = 10;

  private readonly drawer = new CharacterDrawer();

  constructor(
    readonly id: string,
    readonly object: Body,
    readonly message: string,
    readonly sender: string,
    readonly radius: number,
    readonly color: string,
    collision: boolean = true,
  ) {
    this.collision = collision;
    this.object.id = Common.nextId();
    this.object.label = 'character';
    Body.scale(this.object, CharacterDrawer.scaleX, CharacterDrawer.scaleY);
  }

  get position() {
    return this.object.position;
  }

  onBeforeUpdate() {
    this.controlSpeed();
    // 回転の防止
    Body.setAngle(this.object, 0);
  }

  /**
   * 速度に応じて減衰をかけ、キャラクターの速度が一定以上に達しないように制御する。
   */
  controlSpeed() {
    const { speed, velocity } = this.object;
    const { maxSpeed } = Character;

    // 最大速度以下に抑える
    if (speed > maxSpeed) {
      const newVelocity = Vector.mult(Vector.normalise(velocity), maxSpeed);
      Body.setVelocity(this.object, newVelocity);
      return;
    }

    // 減衰させる
    // 最大速度の20％になった時点で、減衰率を上げ画面外に出ていかないようにする。
    let decelerationRate;
    if (speed < maxSpeed * 0.2) decelerationRate = 0.15;
    else decelerationRate = 0.03;

    const newVelocity = Vector.mult(this.object.velocity, 1.0 - decelerationRate);
    Body.setVelocity(this.object, newVelocity);
  }

  /**
   * 他のキャラクターとの衝突をするかどうかを設定。
   */
  set collision(value: boolean) {
    if (value) {
      this.object.collisionFilter = {
        group: 0,
        category: 0x2,
        // eslint-disable-next-line no-bitwise
        mask: 0x2 | 0x1,
      };
    } else {
      this.object.collisionFilter = {
        group: -1,
      };
    }
  }

  draw(p5: P5Types) {
    this.drawer.drawBody(this, p5);
    const textBoxBottomY = this.drawer.drawMessage(this, p5);
    this.drawer.drawSenderName(this, p5, textBoxBottomY);
  }

  // ============================
  // Character Actions
  // ============================
  moveSomeWhere() {
    const sign = {
      x: Math.random() < 0.5 ? -1 : 1,
      y: Math.random() < 0.5 ? -1 : 1,
    };
    const velocity: Vector = Vector.mult(
      Vector.normalise(Vector.create(
        sign.x * Math.random(),
        sign.y * Math.random(),
      )),
      Character.maxSpeed,
    );
    Body.setVelocity(this.object, velocity);
  }
}
