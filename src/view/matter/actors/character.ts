import Matter, { Common } from 'matter-js';
import P5Types from 'p5';

/**
 * キャラクター（オブジェクトとテキストの情報を持っている）
 *  @param {Matter.Body} object オブジェクトデータ
 *  @param {string} text テキストデータ
 *  @param {string} id 識別用文字列
 */
export class Character {
  protected readonly _text: string;

  private readonly _object: Matter.Body;

  public readonly maxSpeed = 50;

  constructor(
    readonly id: string,
    object: Matter.Body,
    text: string,
  ) {
    this._object = object;
    this._object.id = Common.nextId();
    this._text = text;
    // ラベルの設定
    this._object.label = 'character';
  }

  get object(): Matter.Body {
    return this._object;
  }

  get text(): string {
    return this._text;
  }

  getColor(p5: P5Types): P5Types.Color {
    if (this.object.render.fillStyle) {
      return p5.color(this.object.render.fillStyle);
    }
    console.log(`${this}\nCannot get object color. rgb is to be white`);
    return p5.color('white');
  }

  draw(p5: P5Types) {
    const radius: number = (this.object.circleRadius !== undefined) ? this.object.circleRadius : 0;
    // bodyの描画
    p5.push();
    p5.fill(this.getColor(p5))
      .circle(this.object.position.x, this.object.position.y, radius * 2);
    p5.pop();

    // textの描画
    const textSize = 32;
    const degree = 40; // 度数法で入力 ( 0 < degree < 90 )
    const radian = (degree * Math.PI) / 180; // 弧度法
    const rCosine = radius * Math.cos(radian);
    const textBoxWidth = 2 * rCosine;
    let sliceStr = this.text;
    let startPosition;
    let printText = '';
    const list = [];
    // listにtextを区切って格納
    for (let i = 0, textWidth = 0; i < this.text.length; i += 1) {
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
    // startPositionの決定
    if (list.length === 1) {
      startPosition = {
        x: this.object.position.x,
        y: this.object.position.y,
      };
    } else if (list.length % 2 === 0) {
      startPosition = {
        x: this.object.position.x - rCosine,
        y: this.object.position.y - textSize * 0.5 - textSize * (list.length * 0.5 - 1),
      };
    } else {
      startPosition = {
        x: this.object.position.x - rCosine,
        y: this.object.position.y - textSize * Math.floor(list.length * 0.5),
      };
    }
    // 格納したtextの描画
    if (list.length === 1) {
      p5.fill(0)
        .textAlign('center', 'center')
        .textSize(textSize)
        .text(list[0], startPosition.x, startPosition.y);
    } else {
      for (let i = 0; i < list.length; i += 1) {
        p5.fill(0)
          .textAlign('left', 'center')
          .textSize(textSize)
          .text(list[i], startPosition.x, startPosition.y + textSize * i);
      }
    }
  }

  beforeUpdate() {
    this.controllSpeed();
    this.preventRotate();
  }

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
    if (this.object.speed < 1.0) {
      // オブジェクトの速さがほぼ0であれば完全に停止
      deceleration = 0.0;
    } else if (this.object.speed < this.maxSpeed * 0.2) {
      // オブジェクトの速さがmaxSpeedの10分の2を下回ると急激に減速する。
      deceleration = 0.7;
    } else {
      // speed >= max * 0.1 && speed <= max ならば減速率0.98とする
      deceleration = 0.98;
    }
    const velocity = Matter.Vector.mult(
      this.object.velocity,
      deceleration,
    );
    Matter.Body.setVelocity(this.object, velocity);
    console.log(deceleration);
    console.log(`x: ${this.object.velocity.x}, y: ${this.object.velocity.y}\nspeed: ${this.object.speed}`);
  }

  preventRotate() {
    Matter.Body.setAngle(this.object, 0);
  }
}
