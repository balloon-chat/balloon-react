import { Body, Common, Vector } from 'matter-js';
import P5Types from 'p5';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';
import { CharacterAction, EyePosition } from 'src/view/matter/actors/character/types';

/**
 * キャラクター（オブジェクトとテキストの情報を持っている）
 *  @param {Body} object オブジェクトデータ
 *  @param {string} text テキストデータ
 *  @param {string} id 識別用文字列
 *  @param {number} radius 半径
 *  @param {string} color 色
 */
export class Character implements CharacterAction {
  public static readonly maxSpeed = 20;

  private static readonly scaleX = 1.25;

  private static readonly scaleY = 1;

  private static readonly textSize = 16;

  constructor(
    readonly id: string,
    readonly object: Body,
    readonly text: string,
    readonly radius: number,
    readonly color: string,
  ) {
    this.object.id = Common.nextId();
    this.object.label = 'character';
    Body.scale(this.object, Character.scaleX, Character.scaleY);
  }

  get position() {
    return this.object.position;
  }

  private get eyePosition(): EyePosition {
    return {
      left: Vector.create(
        this.position.x - this.radius * 0.35,
        this.position.y - this.radius * 0.45,
      ),
      right: Vector.create(
        this.position.x + this.radius * 0.35,
        this.position.y - this.radius * 0.45,
      ),
    };
  }

  /**
   * テキストがボックスに入るように分割する
   */
  static getTextLines(p5: P5Types, text: string, radius: number): string[] {
    let texts = text;
    let textLine = '';
    const textLines = [];
    const textBoxWidth = Character.getTextBoxWidth(radius);

    // テキストボックスに収まるように、テキストを行に分割
    p5.textSize(Character.textSize);
    for (let i = 0, prevTextWidth = 0; i < text.length; i += 1) {
      const currentChar = texts[0];
      const textWidth = prevTextWidth + p5.textWidth(currentChar);
      if (textWidth > textBoxWidth) {
        // テキストボックスより文字幅が大きくなったら、改行
        textLines.push(textLine);
        prevTextWidth = 0;
        textLine = '';
      } else {
        // テキストボックスより文字幅が小さければ、行に文字を追加
        textLine += currentChar;
        prevTextWidth += p5.textWidth(currentChar);
        texts = texts.slice(1);
      }
    }
    textLines.push(textLine);

    return textLines;
  }

  static getTextBoxWidth(radius: number) {
    const degree = 40; // 度数法で入力 ( 0 < degree < 90 )
    const radian = (degree * Math.PI) / 180; // 弧度法
    const rCosine = radius * Math.cos(radian);
    return 2 * rCosine * Character.scaleX;
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
   * 画面外に出たときに中に戻す
   */
  preventInvisible(canvas: CanvasParameter) {
    if (this.isVisible(canvas)) return;
    if (this.position.x + this.radius * Character.scaleX * 2 < 0) {
      this.position.x = canvas.width + this.radius * 1.25 * 2;
    } else if (this.position.x - this.radius * Character.scaleX * 2 > canvas.width) {
      this.position.x = 0 - this.radius * 1.25 * 2;
    }

    if (this.position.y + this.radius * Character.scaleY * 2 < 0) {
      this.position.y = canvas.height + this.radius * Character.scaleY * 2;
    } else if (this.position.y - this.radius * Character.scaleY * 2 > canvas.height) {
      this.position.y = 0 - this.radius * Character.scaleY * 2;
    }

    Body.setPosition(this.object, this.position);
  }

  draw(p5: P5Types) {
    this.drawCharacter(p5);
    this.drawText(p5);
  }

  private drawCharacter(p5: P5Types) {
    // bodyの描画
    p5.push();
    p5.fill(this.color)
      .noStroke()
      .ellipse(
        this.position.x,
        this.position.y,
        this.radius * 2 * Character.scaleX,
        this.radius * 2 * Character.scaleY,
      );
    p5.pop();

    // 目の描画
    p5.push();
    p5.fill('#585858')
      .noStroke()
      .circle(this.eyePosition.left.x, this.eyePosition.left.y, this.radius * 0.15)
      .circle(this.eyePosition.right.x, this.eyePosition.right.y, this.radius * 0.15);
    p5.pop();
  }

  private drawText(p5: P5Types) {
    // textの描画
    const textLines = Character.getTextLines(p5, this.text, this.radius);

    // 目とキャラクター下端との中点。これを基準としてテキストを配置していく。
    const basePosition = Vector.create(
      this.position.x,
      this.eyePosition.left.y + (this.radius * Character.scaleX) * Math.tan(75 / 180),
    );
    p5.textSize(Character.textSize);

    const textBoxWidth = Character.getTextBoxWidth(this.radius);
    const textBoxHeight = textLines.length * Character.textSize;
    let startPosition: Vector;
    if (textLines.length === 1) {
      // 一行だけのときは、中央寄せ
      startPosition = Vector.create(
        basePosition.x,
        basePosition.y - textBoxHeight / 3,
      );
    } else {
      // 複数行のときは、左詰め
      startPosition = Vector.create(
        basePosition.x - textBoxWidth / 2,
        basePosition.y - textBoxHeight / 3,
      );
    }
    // 格納したtextの描画
    if (textLines.length === 1) {
      p5.fill(0)
        .textAlign('center', 'center')
        .textSize(Character.textSize)
        .text(textLines[0], startPosition.x, startPosition.y);
    } else {
      for (let i = 0; i < textLines.length; i += 1) {
        p5.fill(0)
          .textAlign('left', 'center')
          .textSize(Character.textSize)
          .text(textLines[i], startPosition.x, startPosition.y + Character.textSize * i);
      }
    }
  }

  /**
   * 画面内にあるかどうかを判断する
   */
  private isVisible(canvas: CanvasParameter): boolean {
    const radius = this.object.circleRadius ?? 0;
    const [positionLeft, positionRight, positionTop, positionBottom] = [
      this.position.x - radius * Character.scaleX,
      this.position.x + radius * Character.scaleX,
      this.position.y + radius * Character.scaleY,
      this.position.y - radius * Character.scaleY,
    ];
    const isInnerLeft = positionLeft < 0;
    const isInnerRight = positionRight > canvas.width;
    const isInnerTop = positionTop < 0;
    const isInnerBottom = positionBottom > canvas.height;
    return isInnerLeft && isInnerRight && isInnerTop && isInnerBottom;
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
