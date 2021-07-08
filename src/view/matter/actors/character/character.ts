import Matter, { Body, Common, Vector } from 'matter-js';
import P5Types from 'p5';
import { CharacterAction } from 'src/view/matter/actors/character/types';
import { CharacterDrawer } from 'src/view/matter/actors/character/characterDrawer';

export class Character implements CharacterAction {
  public static readonly maxSpeed = 10;

  private readonly drawer = new CharacterDrawer(1.0, 1.0);

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
    const {
      speed,
      velocity,
    } = this.body;
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
    Body.setVelocity(this.body, velocity);
  }

  /**
   * @param span アニメーションにかかる時間(ミリ秒)
   * @param onStart アニメーション開始時のコールバック関数
   */
  popout(span: number, onStart: () => void) {
    // スケールの計算
    const scaleCal = (x: number, span: number, maxScale: number) => {
      // 小数をある程度切り捨てる
      const rX: number = Math.round(x * 100) / 100;
      const rM: number = Math.round(maxScale * 10) / 10;
      const a: number = -(4 * rM - 4) / span ** 2;
      const b: number = (4 * rM - 4) / span;
      const c: number = 1;
      return a * rX ** 2 + b * rX + c;
    };

    onStart();

    const interval: number = span / 100;
    let currentTime: number = 0;
    const id = setInterval(() => {
      if (currentTime <= span) {
        this.drawer.scale = scaleCal(currentTime, span, 1.5);
        currentTime += interval;
      } else {
        clearInterval(id);
      }
    }, interval);
  }

  /**
   * @param span アニメーションにかかる時間(ミリ秒)
   * @param onFadeOuted アニメーション終了時のコールバック関数
   */
  fadeout(span: number, onFadeOuted: () => void) {
    const interval = span / 100;
    const id = setInterval(() => {
      if (this.drawer.opacity > 0) {
        this.drawer.opacity -= 1 / 100;
      } else {
        onFadeOuted();
        clearInterval(id);
      }
    }, interval);
  }
}
