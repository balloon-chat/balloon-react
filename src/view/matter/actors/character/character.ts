import Matter, { Body, Common, Vector } from 'matter-js';
import P5Types from 'p5';
import { CharacterDrawer } from 'src/view/matter/actors/character/drawer/characterDrawer';
import { CharacterAnimator } from 'src/view/matter/actors/character/animator/characterAnimator';
import { CharacterPopoutAnimator } from 'src/view/matter/actors/character/animator/characterPopoutAnimator';
import { v4 as uuidv4 } from 'uuid';
import { CharacterFadeoutAnimator } from 'src/view/matter/actors/character/animator/characterFadeoutAnimator';

export class Character {
  public static readonly maxSpeed = 10;

  private readonly drawer = new CharacterDrawer();

  // key: アニメーターのID
  private readonly animators: Map<string, CharacterAnimator> = new Map();

  /**
   * キャラクター（オブジェクトとテキストの情報を持っている）
   *  @param {Body} body オブジェクトデータ
   *  @param {string} message キャラクターに用事させるメッセージ
   *  @param {string} id 識別用文字列
   *  @param {string} sender メッセージ送信者のID
   *  @param {number} radius 半径
   *  @param {string} color キャラクターの体の色
   *  @param {boolean} collision キャラクター同士の衝突を判定するかどうか
   */
  constructor(
    readonly id: string,
    readonly body: Body,
    readonly message: string,
    readonly sender: string,
    readonly radius: number,
    readonly color: string,
    collision: boolean = true,
  ) {
    this.collision = collision;
    this.body.id = Common.nextId();
    this.body.label = 'character';
    Body.scale(this.body, CharacterDrawer.scaleX, CharacterDrawer.scaleY);
  }

  get position() {
    return this.body.position;
  }

  set position(position: Vector) {
    Matter.Body.setPosition(this.body, position);
  }

  /**
   * 他のキャラクターとの衝突をするかどうかを設定。
   */
  set collision(value: boolean) {
    if (value) {
      this.body.collisionFilter = {
        group: 0,
        category: 0x2,
        // eslint-disable-next-line no-bitwise
        mask: 0x2 | 0x1,
      };
    } else {
      this.body.collisionFilter = {
        group: -1,
      };
    }
  }

  /**
   * 速度に応じて減衰をかけ、キャラクターの速度が一定以上に達しないように制御する。
   */
  controlSpeed() {
    const { speed, velocity } = this.body;
    const { maxSpeed } = Character;

    // 最大速度以下に抑える
    if (speed > maxSpeed) {
      const newVelocity = Vector.mult(Vector.normalise(velocity), maxSpeed);
      Body.setVelocity(this.body, newVelocity);
      return;
    }

    // 減衰させる
    // 最大速度の20％になった時点で、減衰率を上げ画面外に出ていかないようにする。
    let decelerationRate;
    if (speed < maxSpeed * 0.2) {
      decelerationRate = 0.15;
    } else {
      decelerationRate = 0.03;
    }

    const newVelocity = Vector.mult(this.body.velocity, 1.0 - decelerationRate);
    Body.setVelocity(this.body, newVelocity);
  }

  draw(p5: P5Types) {
    // CharacterAnimatorにより、アニメーションに対応するパラメータの変更を行う
    this.animators.forEach((animator) => animator.animate(this.drawer));

    // CharacterDrawerにより、描画を行う。
    this.drawer.draw(this, p5);
  }

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
    Body.setVelocity(this.body, velocity);
  }

  /**
   * @param duration アニメーションにかかる時間(ミリ秒)
   * @param onStart アニメーション開始時のコールバック関数
   */
  popout(duration: number, onStart: () => void) {
    const animatorId = uuidv4();
    const animator = new CharacterPopoutAnimator(
      duration,
      {
        onStart,
        onEnd: () => { this.animators.delete(animatorId); },
      },
    );
    this.animators.set(animatorId, animator);
  }

  /**
   * @param duration アニメーションにかかる時間(ミリ秒)
   * @param onFadeOuted アニメーション終了時のコールバック関数
   */
  fadeout(duration: number, onFadeOuted: () => void) {
    const animatorId = uuidv4();
    const animator = new CharacterFadeoutAnimator(
      duration,
      {
        onEnd: () => {
          this.animators.delete(animatorId);
          onFadeOuted();
        },
      },
    );
    this.animators.set(animatorId, animator);
  }
}
