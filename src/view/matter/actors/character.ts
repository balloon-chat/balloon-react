import Matter from 'matter-js';
import { randomId } from 'src/view/matter/util/randomId';
import P5Types from 'p5';
import { drawVertices } from 'src/view/matter/util/drawVertices';

/**
 * キャラクター（オブジェクトとテキストの情報を持っている）
 *  @param {Matter.Body} object オブジェクトデータ
 *  @param {string} text テキストデータ
 *  @param {string} id 識別用文字列
 */
export class Character {

  // tslint:disable-next-line:variable-name
  protected readonly _text: string;
  // tslint:disable-next-line:variable-name
  private readonly _object: Matter.Body;

  constructor(object: Matter.Body, text: string) {
    this._object = object;
    this._object.id = randomId();
    // Matter.Body.scale(this._object, 2, 1);
    this._text = text;
    // ラベルの設定
    this._object.label = 'character';
  }

  get id(): number {
    return this._object.id;
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
    console.log('Cannot get object color. rgb is to be white');
    return p5.color('white');
  }

  draw(p5: P5Types) {
    p5.fill(this.getColor(p5));
    drawVertices(p5, this.object.vertices);
    p5.fill(0);
    p5.text(this.text, this.object.position.x, this.object.position.y);
  }
}
