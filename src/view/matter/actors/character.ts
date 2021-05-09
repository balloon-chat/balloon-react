/* eslint-disable max-len */
import Matter, { Common, Vector } from 'matter-js';
import P5Types from 'p5';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';
import { MatterController } from 'src/view/matter/controllers/matterController';

/**
 * キャラクター（オブジェクトとテキストの情報を持っている）
 *  @param {Matter.Body} object オブジェクトデータ
 *  @param {string} text テキストデータ
 *  @param {string} id 識別用文字列
 *  @param {number} radius 半径
 *  @param {string} color 色
 *  @param {boolean} isLatest 最新のキャラクターかどうか
 */
export class Character {
  protected readonly _text: string;

  private readonly _object: Matter.Body;

  public readonly maxSpeed = 1.5;

  private static scaleX = 1.25;

  private static scaleY = 1;

  constructor(
    readonly id: string,
    object: Matter.Body,
    text: string,
    readonly radius: number,
    readonly color: string,
  ) {
    this._object = object;
    this._object.id = Common.nextId();
    this._text = text;
    // ラベルの設定
    this._object.label = 'character';
    Matter.Body.scale(this.object, Character.scaleX, Character.scaleY);
    console.log('キャラクターが生成されました');
  }

  get object(): Matter.Body {
    return this._object;
  }

  get text(): string {
    return this._text;
  }

  draw(p5: P5Types) {
    // bodyの描画
    p5.push();
    p5.fill(this.color)
      .noStroke()
      // eslint-disable-next-line max-len
      .ellipse(this.object.position.x, this.object.position.y, this.radius * 2 * Character.scaleX, this.radius * 2 * Character.scaleY);
    p5.pop();

    const eyePosition = {
      left: {
        x: this.object.position.x - this.radius * 0.35,
        y: this.object.position.y - this.radius * 0.45,
      },
      right: {
        x: this.object.position.x + this.radius * 0.35,
        y: this.object.position.y - this.radius * 0.45,
      },
    };
    p5.push();
    p5.fill('#585858')
      .noStroke()
      .circle(eyePosition.left.x, eyePosition.left.y, this.radius * 0.15)
      .circle(eyePosition.right.x, eyePosition.right.y, this.radius * 0.15);
    p5.pop();

    // textの描画
    const textLines = Character.getTextLines(this.text, this.radius, p5);
    const textBoxWidth = Character.getTextBoxWidth(this.radius);
    const textSize = 16;
    let startPosition;
    // 目とキャラクター下端との中点。これを基準としてテキストを配置していく。
    const basePosition = {
      x: this.object.position.x,
      y: (eyePosition.left.y + (this.object.position.y + this.radius * Character.scaleY)) * 0.5,
    };
    p5.textSize(textSize);
    // startPositionの決定
    // 行数が偶数か奇数で場合分け
    if (textLines.length === 1) {
      // 1のとき
      startPosition = {
        x: basePosition.x,
        y: basePosition.y - textSize * Math.floor(textLines.length * 0.5),
      };
    } else if (textLines.length % 2 === 0) {
      // 偶数のとき
      startPosition = {
        x: basePosition.x - textBoxWidth * 0.5,
        y: basePosition.y - textSize * 0.5 - textSize * (textLines.length * 0.5 - 1),
      };
    } else {
      // 奇数のとき
      startPosition = {
        x: basePosition.x - textBoxWidth * 0.5,
        y: basePosition.y - textSize * Math.floor(textLines.length * 0.5),
      };
    }
    // 格納したtextの描画
    if (textLines.length === 1) {
      p5.fill(0)
        .textAlign('center', 'center')
        .textSize(textSize)
        .text(textLines[0], startPosition.x, startPosition.y);
    } else {
      for (let i = 0; i < textLines.length; i += 1) {
        p5.fill(0)
          .textAlign('left', 'center')
          .textSize(textSize)
          .text(textLines[i], startPosition.x, startPosition.y + textSize * i);
      }
    }
  }

  /**
   * matterのアップデート前に行われる関数
   */
  beforeUpdateOnMatter(_controller: MatterController) {
    // 回転の防止
    Matter.Body.setAngle(this.object, 0);
    // this.preventInvisible(_controller.canvas);
  }

  /**
   * matterのアップデート前に行われる関数
   */
  afterUpdateOnMatter(_controller: MatterController) {
    this.controllSpeed();
  }

  /**
   * マウスがクリックされたときに行われる関数
   */
  mousePressed(_matterController: MatterController, mouseX: number, mouseY: number) {
    if (this.isClicked(mouseX, mouseY)) {
      // do something when this character is touched.
    }
  }

  /**
   * スピードの制御
   */
  controllSpeed() {
    if (this.object.speed > this.maxSpeed) {
      const velocity = Matter.Vector.mult(
        Matter.Vector.normalise(this.object.velocity),
        this.maxSpeed,
      );
      Matter.Body.setVelocity(this.object, velocity);
      return;
    }
    let deceleration;
    if (this.object.speed < 0.1) {
      // オブジェクトの速さがほぼ0であれば完全に停止
      deceleration = 0.0;
    } else if (this.object.speed < this.maxSpeed * 0.2) {
      // オブジェクトの速さがmaxSpeedの10分の2を下回ると急激に減速する。
      deceleration = 0.9;
    } else {
      // speed >= max * 0.1 && speed <= max ならば減速率0.98とする
      deceleration = 0.98;
    }
    const velocity = Matter.Vector.mult(
      this.object.velocity,
      deceleration,
    );
    Matter.Body.setVelocity(this.object, velocity);
  }

  /**
   * 画面内にあるかどうかを判断する
   */
  isVisible(canvas: CanvasParameter): boolean {
    const radius = this.object.circleRadius ?? 0;
    const [positionLeft, positionRight, positionTop, positionBottom] = [
      this.object.position.x - radius * Character.scaleX,
      this.object.position.x + radius * Character.scaleX,
      this.object.position.y - radius * Character.scaleY,
      this.object.position.y + radius * Character.scaleY,
    ];
    const isInnerLeft = positionLeft < 0;
    const isInnerRight = positionRight > canvas.width;
    const isInnerTop = positionTop < 0;
    const isInnerBottom = positionBottom > canvas.height;
    return isInnerLeft && isInnerRight && isInnerTop && isInnerBottom;
  }

  /**
   * 画面外に出たときに中に戻す
  */
  preventInvisible(canvas: CanvasParameter) {
    if (this.isVisible(canvas)) return;
    // eslint-disable-next-line prefer-destructuring
    const position: Matter.Vector = {
      x: this.object.position.x,
      y: this.object.position.y,
    };
    if (position.x + this.radius * Character.scaleX * 2 < 0) {
      position.x = canvas.width + this.radius * 1.25 * 2;
    } else if (position.x - this.radius * Character.scaleX * 2 > canvas.width) {
      position.x = 0 - this.radius * 1.25 * 2;
    }

    if (position.y + this.radius * Character.scaleY * 2 < 0) {
      position.y = canvas.height + this.radius * Character.scaleY * 2;
    } else if (position.y - this.radius * Character.scaleY * 2 > canvas.height) {
      position.y = 0 - this.radius * Character.scaleY * 2;
    }

    Matter.Body.setPosition(this.object, position);
  }

  moveSomeWhere() {
    const sign = {
      x: Math.random() < 0.5 ? -1 : 1,
      y: Math.random() < 0.5 ? -1 : 1,
    };
    const velocity: Vector = Vector.mult(
      Matter.Vector.normalise({
        x: sign.x * Math.random(),
        y: sign.y * Math.random(),
      }),
      this.maxSpeed,
    );
    Matter.Body.setVelocity(this.object, velocity);
  }

  /**
   * マウスとキャラクターの位置との角度を測る
   * @returns radian
   */
  private getRadian(mouseX: number, mouseY: number):number {
    const radian = Math.atan2(mouseX - this.object.position.x, mouseY - this.object.position.y);
    return radian;
  }

  /**
   * クリックされているかどうかを判断する
  */
  private isClicked(mouseX: number, mouseY: number):boolean {
    const dist1 = (mouseX - this.object.position.x) ** 2 + (mouseY - this.object.position.y) ** 2;
    const radian = this.getRadian(mouseX, mouseY);
    const dist2 = (this.radius * Character.scaleX * Math.cos(radian)) ** 2 + (this.radius * Character.scaleY * Math.sin(radian)) ** 2;
    if (dist1 < dist2) return true;
    return false;
  }

  /**
   * テキストがテキストボックスの内部に入るように分割して配列に格納する
   * @returns 分割されたテキストの配列
   */
  static getTextLines(text: string, size: number, p5: P5Types): string[] {
    const textSize = 16;
    const textBoxWidth = Character.getTextBoxWidth(size);
    let sliceStr = text;
    let printText = '';
    const list = [];

    p5.textSize(textSize);
    // listにtextを区切って格納
    for (let i = 0, textWidth = 0; i < text.length; i += 1) {
      if (textWidth + p5.textWidth(sliceStr.charAt(0)) > textBoxWidth) {
        list.push(printText);
        textWidth = 0;
        printText = '';
      }
      printText += sliceStr.charAt(0);
      textWidth += p5.textWidth(sliceStr.charAt(0));
      sliceStr = sliceStr.slice(1, sliceStr.length);
    }
    list.push(printText);

    return list;
  }

  static getTextBoxWidth(radius: number) {
    const degree = 40; // 度数法で入力 ( 0 < degree < 90 )
    const radian = (degree * Math.PI) / 180; // 弧度法
    const rCosine = radius * Math.cos(radian);
    return 2 * rCosine * Character.scaleX;
  }
}
