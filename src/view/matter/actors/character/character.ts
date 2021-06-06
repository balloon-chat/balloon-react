import { Body, Common, Vector } from 'matter-js';
import P5Types from 'p5';
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
  public static readonly maxSpeed = 10;

  private static readonly scaleX = 1.25;

  private static readonly scaleY = 1;

  private static readonly messageTextSize = 16;

  private static readonly senderNameTextSize = 14;

  constructor(
    readonly id: string,
    readonly object: Body,
    readonly message: string,
    readonly sender: string,
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
    const textBoxWidth = Character.getTextBoxWidth(radius);

    // テキストボックスに収まるように、テキストを行に分割
    p5.textSize(Character.messageTextSize);
    let currentLine = 0;
    const textLines: string[] = [];
    text.split('').forEach((char) => {
      const currentLineTextWidth = p5.textWidth(textLines[currentLine]);
      const textWidth = currentLineTextWidth + p5.textWidth(char);

      // テキストボックスより文字幅が大きくなったら、改行
      if (textWidth > textBoxWidth) currentLine += 1;

      // 行に文字を追加
      if (!textLines[currentLine]) textLines[currentLine] = '';
      textLines[currentLine] += char;
    });

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

  draw(p5: P5Types) {
    this.drawCharacter(p5);
    const textBoxBottomY = this.drawMessage(p5);
    this.drawSenderName(p5, textBoxBottomY);
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

  private drawMessage(p5: P5Types): number {
    // textの描画
    const textLines = Character.getTextLines(p5, this.message, this.radius);

    // 目とキャラクター下端との中点。これを基準としてテキストを配置していく。
    const basePosition = Vector.create(
      this.position.x,
      this.eyePosition.left.y + (this.radius * Character.scaleX) * Math.tan(75 / 180),
    );
    p5.textSize(Character.messageTextSize);

    const textBoxWidth = Character.getTextBoxWidth(this.radius);
    const textBoxHeight = textLines.length * Character.messageTextSize;
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

    let bottomYPosition: number;
    // 格納したtextの描画
    if (textLines.length === 1) {
      p5.fill(0)
        .textAlign('center', 'center')
        .textSize(Character.messageTextSize)
        .text(textLines[0], startPosition.x, startPosition.y);
      bottomYPosition = startPosition.y + Character.messageTextSize;
    } else {
      for (let i = 0; i < textLines.length; i += 1) {
        p5.fill(0)
          .textAlign('left', 'center')
          .textSize(Character.messageTextSize)
          .text(textLines[i], startPosition.x, startPosition.y + Character.messageTextSize * i);
      }
      bottomYPosition = startPosition.y + Character.messageTextSize * textLines.length;
    }

    return bottomYPosition;
  }

  private drawSenderName(p5: P5Types, textBoxBottomY: number) {
    p5.fill('#2D2D2D')
      .textSize(Character.senderNameTextSize)
      .textAlign('center', 'center')
      .text(`@ ${this.sender}`, this.position.x, textBoxBottomY + 8);
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
