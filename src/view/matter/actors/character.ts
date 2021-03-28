import Matter, { Common } from 'matter-js';
import P5Types from 'p5';

/**
 * キャラクター（オブジェクトとテキストの情報を持っている）
 *  @param {Matter.Body} object オブジェクトデータ
 *  @param {string} text テキストデータ
 *  @param {string} id 識別用文字列
 *  @param {number} radius 円の半径
 */
export class Character {
  protected readonly _text: string;

  private readonly _object: Matter.Body;

  constructor(
    readonly id: string,
    object: Matter.Body,
    text: string,
    readonly radius: number,
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
    // bodyの描画
    p5.push();
    p5.fill(this.getColor(p5))
      .circle(this.object.position.x, this.object.position.y, this.radius * 2);
    p5.pop();

    // textの描画
    const textSize = 16;
    const degree = 50; // 度数法で入力 ( 0 < degree < 90 )
    const radian = (degree * Math.PI) / 180; // 弧度法
    const rSine = this.radius * Math.sin(radian);
    const rCosine = this.radius * Math.cos(radian);
    p5.push();
    p5.fill(0)
      .textSize(textSize)
      .textAlign('center', 'center')
      .text(
        this.text,
        this.object.position.x - rCosine,
        this.object.position.y - rSine,
        2 * rCosine,
        2 * rSine,
      );
    p5.pop();
  }
}
