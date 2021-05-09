import Matter, { Common, Vector } from 'matter-js';
import P5Types from 'p5';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';
import { MatterController } from 'src/view/matter/controllers/matterController';

interface CharacterAction {
  /**
   * キャラクターをランダムな方向、速度で移動
   */
  moveSomeWhere(): void;
}

export class Character implements CharacterAction {
  private static readonly maxSpeed = 20;

  private static readonly scaleX = 1.25;

  private static readonly scaleY = 1;

  private static readonly textSize = 16;

  constructor(
    readonly id: string,
    readonly object: Matter.Body,
    readonly text: string,
    readonly radius: number,
    readonly color: string,
  ) {
    this.object.id = Common.nextId();
    this.object.label = 'character';
    Matter.Body.scale(this.object, Character.scaleX, Character.scaleY);

    this.text = text;
  }

  get position() {
    return this.object.position;
  }

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

  /**
   * matterのアップデート前に行われる関数
   */
  onBeforeUpdate() {
    this.controlSpeed();
    // 回転の防止
    Matter.Body.setAngle(this.object, 0);
  }

  /**
   * マウスがクリックされたときに行われる関数
   */
  onMousePressed(_matterController: MatterController, mouseX: number, mouseY: number) {
    if (this.isClicked(mouseX, mouseY)) {
      // do something when this character is touched.
    }
  }

  /**
   * 速度に応じて減衰をかけ、キャラクターの速度が一定以上に達しないように制御する。
   */
  controlSpeed() {
    if (this.object.speed > Character.maxSpeed) {
      const velocity = Matter.Vector.mult(
        Matter.Vector.normalise(this.object.velocity),
        Character.maxSpeed,
      );
      Matter.Body.setVelocity(this.object, velocity);
      return;
    }
    let deceleration;
    if (this.object.speed < 0.5) {
      // オブジェクトの速さがほぼ0であれば完全に停止
      deceleration = 0.0;
    } else if (this.object.speed < Character.maxSpeed * 0.2) {
      // オブジェクトの速さがmaxSpeedの20%を下回ると急激に減速する。
      deceleration = 0.9;
    } else {
      // 速度がmaxSpeedの10%以上、100%以下ならば減速率0.98とする
      deceleration = 0.98;
    }
    const velocity = Matter.Vector.mult(
      this.object.velocity,
      deceleration,
    );
    Matter.Body.setVelocity(this.object, velocity);
  }

  draw(p5: P5Types) {
    this.drawCharacter(p5);
    this.drawText(p5);
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

    Matter.Body.setPosition(this.object, this.position);
  }

  // eslint-disable-next-line class-methods-use-this
  moveSomeWhere(): void {
    const sign = {
      x: Math.random() < 0.5 ? -1 : 1,
      y: Math.random() < 0.5 ? -1 : 1,
    };
    const velocity: Vector = Vector.mult(
      Matter.Vector.normalise({
        x: sign.x * Math.random(),
        y: sign.y * Math.random(),
      }),
      Character.maxSpeed * Math.random(),
    );
    Matter.Body.setVelocity(this.object, velocity);
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
    const eyePositionLeftX = this.position.x - this.radius * 0.35;
    const eyePositionRightX = this.position.x + this.radius * 0.35;
    const eyePositionY = this.position.y - this.radius * 0.45;
    const eyeDiameter = this.radius * 0.15;
    p5.push();
    p5.fill('#585858')
      .noStroke()
      .circle(eyePositionLeftX, eyePositionY, eyeDiameter)
      .circle(eyePositionRightX, eyePositionY, eyeDiameter);
    p5.pop();
  }

  private drawText(p5: P5Types) {
    // textの描画
    const textLines = Character.getTextLines(p5, this.text, this.radius);

    // テキストの開始位置を取得
    let startPosition;
    if (textLines.length === 1) {
      // 一行のみのときは、中央寄せ
      startPosition = {
        x: this.position.x,
        y: this.position.y,
      };
    } else {
      // 複数行のときは、左詰め
      startPosition = {
        x: this.position.x - Character.getTextBoxWidth(this.radius) / 2,
        y: this.position.y - Character.textSize / 2,
      };
    }

    // textの描画
    if (textLines.length === 1) {
      // 一行のみのときは、中央寄せ
      p5.fill(0)
        .textAlign('center', 'center')
        .textSize(Character.textSize)
        .text(textLines[0], startPosition.x, startPosition.y);
    } else {
      // 複数行のときは、左詰め
      for (let i = 0; i < textLines.length; i += 1) {
        p5.fill(0)
          .textAlign('left', 'center')
          .textSize(Character.textSize)
          .text(textLines[i], startPosition.x, startPosition.y + Character.textSize * i);
      }
    }
  }

  /**
   * クリックされているかどうかを判断する
   */
  private isClicked(mouseX: number, mouseY: number):boolean {
    // キャラクター中央からの、マウスとの距離
    const distFromCenter = (mouseX - this.position.x) ** 2 + (mouseY - this.position.y) ** 2;

    // キャラクター中央からみた、マウスの角度
    const radian = Math.atan2(mouseX - this.position.x, mouseY - this.position.y);
    // キャラクターの中央から、マウスのある角度におけるキャラクターの縁との距離
    const outerX = this.radius * Character.scaleX * Math.cos(radian);
    const outerY = this.radius * Character.scaleY * Math.sin(radian);
    const distOuter = outerX ** 2 + outerY ** 2;

    return distFromCenter < distOuter;
  }

  // ============================
  // Character Actions
  // ============================

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
}
