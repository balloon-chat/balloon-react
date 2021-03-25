import Matter, { Common } from 'matter-js';
import P5Types from 'p5';
import { drawVertices } from 'src/view/matter/util/drawVertices';

/**
 * キャラクター（オブジェクトとテキストの情報を持っている）
 *  @param {Matter.Body} object オブジェクトデータ
 *  @param {string} text テキストデータ
 *  @param {string} id 識別用文字列
 *  @param {number} radius 円の半径
 */
export class Character {

  // tslint:disable-next-line:variable-name
  protected readonly _text: string;
  // tslint:disable-next-line:variable-name
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
    p5.fill(this.getColor(p5));
    drawVertices(p5, this.object.vertices);
    p5.fill(0);

    // textの描画
    const textSize = 70;
    const degree = 50; // 度数法で入力 ( 0 < degree < 90 )
    const radian = degree * Math.PI / 180; // 弧度法
    const rSine = this.radius * Math.sin(radian);
    const rCosine = this.radius * Math.cos(radian);
    p5.textSize(textSize);
    p5.textAlign('center', 'center');
    p5.text(this.text, this.object.position.x - rCosine, this.object.position.y - rSine, 2 * rCosine, 2 * rSine);
  }
}
