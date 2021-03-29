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
    p5.textFont('ＭＳ ゴシック');
    const textSize = 16;
    const degree = 50; // 度数法で入力 ( 0 < degree < 90 )
    const radian = (degree * Math.PI) / 180; // 弧度法
    const rCosine = this.radius * Math.cos(radian);
    const textBoxWidth = 2 * rCosine;
    let sliceStr = this.text;
    let startPosition;  
    let printText = "";
    let list = [];
    // listにtextを区切って格納
    for(let i = 0, textWidth = 0; i < this.text.length; i++){
      if(textWidth + p5.textWidth(sliceStr.charAt(0)) > textBoxWidth){
        list.push(printText)
        textWidth = 0;
        printText = "";
      }
      printText += sliceStr.charAt(0);
      textWidth += p5.textWidth(sliceStr.charAt(0));
      sliceStr = sliceStr.slice(1, sliceStr.length);
    }
    list.push(printText);
    // startPositionの決定
    if(list.length % 2 === 0){
      startPosition = {
        x: this.object.position.x,
        y: this.object.position.y - textSize * 0.5 - textSize * (list.length * 0.5 - 1)
      }
    }else{
      startPosition = {
        x: this.object.position.x,
        y: this.object.position.y - textSize * Math.floor(list.length * 0.5)
      }
    }
    // 格納したtextの描画
    for(let i = 0; i < list.length; i++){
      p5.push();
      p5.fill(0)
        .textAlign('center', 'center')
        .textSize(textSize)
        .text(list[i], startPosition.x, startPosition.y + textSize * i);
    };
  }
}
