import P5Types from 'p5';
import { Character } from 'src/view/matter/actors/character/character';
import { Vector } from 'matter-js';
import { EyePosition } from 'src/view/matter/actors/character/types';

export class CharacterDrawer {
  static readonly scaleX = 1.25;

  static readonly scaleY = 1;

  private static readonly messageTextSize = 16;

  private static readonly senderNameTextSize = 14;

  /**
   * テキストがボックスに入るように分割する
   */
  static getTextLines(p5: P5Types, text: string, radius: number): string[] {
    const textBoxWidth = CharacterDrawer.getTextBoxWidth(radius);

    // テキストボックスに収まるように、テキストを行に分割
    p5.textSize(CharacterDrawer.messageTextSize);
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
    return 2 * rCosine * CharacterDrawer.scaleX;
  }

  // eslint-disable-next-line class-methods-use-this
  getEyePosition(character: Character): EyePosition {
    const { position, radius } = character;
    return {
      left: Vector.create(
        position.x - radius * 0.35,
        position.y - radius * 0.45,
      ),
      right: Vector.create(
        position.x + radius * 0.35,
        position.y - radius * 0.45,
      ),
    };
  }

  drawBody(character: Character, p5: P5Types) {
    // bodyの描画
    p5.push();
    p5.fill(character.color)
      .noStroke()
      .ellipse(
        character.position.x,
        character.position.y,
        character.radius * 2 * CharacterDrawer.scaleX,
        character.radius * 2 * CharacterDrawer.scaleY,
      );
    p5.pop();

    // 目の描画
    const eyePosition = this.getEyePosition(character);
    p5.push();
    p5.fill('#585858')
      .noStroke()
      .circle(eyePosition.left.x, eyePosition.left.y, character.radius * 0.15)
      .circle(eyePosition.right.x, eyePosition.right.y, character.radius * 0.15);
    p5.pop();
  }

  drawMessage(character: Character, p5: P5Types): number {
    // textの描画
    const textLines = CharacterDrawer.getTextLines(p5, character.message, character.radius);

    // 目とキャラクター下端との中点。これを基準としてテキストを配置していく。
    const eyePosition = this.getEyePosition(character);
    const { scaleX, messageTextSize } = CharacterDrawer;
    const basePosition = Vector.create(
      character.position.x,
      eyePosition.left.y + (character.radius * scaleX) * Math.tan(75 / 180),
    );
    p5.textSize(CharacterDrawer.messageTextSize);

    const textBoxWidth = CharacterDrawer.getTextBoxWidth(character.radius);
    const textBoxHeight = textLines.length * messageTextSize;
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
        .textSize(messageTextSize)
        .text(textLines[0], startPosition.x, startPosition.y);
      bottomYPosition = startPosition.y + messageTextSize;
    } else {
      for (let i = 0; i < textLines.length; i += 1) {
        p5.fill(0)
          .textAlign('left', 'center')
          .textSize(messageTextSize)
          .text(textLines[i], startPosition.x, startPosition.y + messageTextSize * i);
      }
      bottomYPosition = startPosition.y + messageTextSize * textLines.length;
    }

    return bottomYPosition;
  }

  // eslint-disable-next-line class-methods-use-this
  drawSenderName(character: Character, p5: P5Types, textBoxBottomY: number) {
    const { position, sender } = character;
    p5.fill('#2D2D2D')
      .textSize(CharacterDrawer.senderNameTextSize)
      .textAlign('center', 'center')
      .text(`@ ${sender}`, position.x, textBoxBottomY + 8);
  }
}