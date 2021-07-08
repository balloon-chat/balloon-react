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
   * @param scale キャラクターの拡大率
   * @param opacity キャラクターの透明度(0 ~ 1)
   */
  constructor(public scale: number, public opacity: number) {
  }

  static getColor({ character, opacity, p5 }:{
    character: Character,
    opacity: number,
    p5: P5Types
  }) {
    const alpha = opacity * 255;

    const colorBody = p5.color(character.color);
    colorBody.setAlpha(alpha);

    const colorText = p5.color(0, alpha);

    const colorEye = p5.color(88, alpha);

    const colorSender = p5.color('#2D2D2D');
    colorSender.setAlpha(alpha);

    return {
      colorBody,
      colorEye,
      colorText,
      colorSender,
    };
  }

  /**
   * テキストがボックスに入るように分割する
   */
  static getTextLines(
    p5: P5Types,
    { text, radius, scale }: {
      text: string,
      radius: number,
      scale: number,
    },
  ): string[] {
    const textBoxWidth = CharacterDrawer.getTextBoxWidth(radius * scale);

    // テキストボックスに収まるように、テキストを行に分割
    p5.textSize(CharacterDrawer.messageTextSize * scale);
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

  getEyePosition(character: Character): EyePosition {
    const { position, radius } = character;
    return {
      left: Vector.create(
        position.x - radius * 0.35 * this.scale,
        position.y - radius * 0.45 * this.scale,
      ),
      right: Vector.create(
        position.x + radius * 0.35 * this.scale,
        position.y - radius * 0.45 * this.scale,
      ),
    };
  }

  drawBody(character: Character, p5: P5Types) {
    const { opacity, scale } = this;

    // 影の描画
    p5.push();
    p5.fill('#0040800f')
      .noStroke()
      .ellipse(
        character.position.x - 5,
        character.position.y + 5,
        character.radius * 2 * CharacterDrawer.scaleX * scale,
        character.radius * 2 * CharacterDrawer.scaleY * scale,
      );
    p5.pop();

    // bodyの描画
    const { colorBody } = CharacterDrawer.getColor({ character, p5, opacity });
    p5.push();
    p5.fill(colorBody)
      .noStroke()
      .ellipse(
        character.position.x,
        character.position.y,
        character.radius * 2 * CharacterDrawer.scaleX * scale,
        character.radius * 2 * CharacterDrawer.scaleY * scale,
      );
    p5.pop();

    // 目の描画
    const eyePosition = this.getEyePosition(character);
    const { colorEye } = CharacterDrawer.getColor({ character, p5, opacity });
    p5.push();
    p5.fill(colorEye)
      .noStroke()
      .circle(eyePosition.left.x, eyePosition.left.y, character.radius * 0.15 * scale)
      .circle(eyePosition.right.x, eyePosition.right.y, character.radius * 0.15 * scale);
    p5.pop();
  }

  drawMessage(character: Character, p5: P5Types): number {
    // textの描画
    const { message, radius } = character;
    const { scale, opacity } = this;
    const textLines = CharacterDrawer.getTextLines(p5, { text: message, radius, scale });

    // 目とキャラクター下端との中点。これを基準としてテキストを配置していく。
    const eyePosition = this.getEyePosition(character);
    const { scaleX, messageTextSize } = CharacterDrawer;
    const basePosition = Vector.create(
      character.position.x,
      eyePosition.left.y + (character.radius * scaleX) * Math.tan(75 / 180),
    );
    p5.textSize(CharacterDrawer.messageTextSize * scale);

    const textBoxWidth = CharacterDrawer.getTextBoxWidth(character.radius * scale);
    const textBoxHeight = textLines.length * messageTextSize * scale;
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
      const { colorText } = CharacterDrawer.getColor({ character, p5, opacity });
      p5.fill(colorText)
        .textAlign('center', 'center')
        .textSize(messageTextSize * scale)
        .text(textLines[0], startPosition.x, startPosition.y);
      bottomYPosition = startPosition.y + messageTextSize * scale;
    } else {
      for (let i = 0; i < textLines.length; i += 1) {
        p5.fill(0)
          .textAlign('left', 'center')
          .textSize(messageTextSize * scale)
          .text(textLines[i], startPosition.x, startPosition.y + messageTextSize * scale * i);
      }
      bottomYPosition = startPosition.y + messageTextSize * scale * textLines.length;
    }

    return bottomYPosition;
  }

  drawSenderName(character: Character, p5: P5Types, textBoxBottomY: number) {
    const { position, sender } = character;
    const { scale, opacity } = this;
    const { colorSender } = CharacterDrawer.getColor({ character, p5, opacity });
    p5.fill(colorSender)
      .textSize(CharacterDrawer.senderNameTextSize * scale)
      .textAlign('center', 'center')
      .text(`@ ${sender}`, position.x, textBoxBottomY + 8);
  }
}
