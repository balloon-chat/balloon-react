/* eslint-disable no-param-reassign */
import P5Types from 'p5';
import { Vector } from 'matter-js';
import { CharacterParams } from 'src/view/matter/actors/character/characterParams';
import { World } from 'src/view/matter/types/world';

export type EyePosition = {
  left: Vector,
  right: Vector,
};

enum CharacterSize {
  small = 80,
  medium = 120,
  large = 160,
}

export class CharacterDrawer {
  static readonly scaleX = 1.25;

  static readonly scaleY = 1;

  private static readonly messageTextSize = 16;

  private static readonly senderNameTextSize = 14;

  static getColor({ character, opacity, p5 }:{
    character: CharacterParams,
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

  static getCharacterSize(
    p5: P5Types,
    isMobile:boolean,
    text: string,
  ): CharacterSize {
    // モバイルで表示するときは、キャラクターの大きさを75%にする
    const expansionRate = isMobile ? 0.75 : 1.0;

    let characterSize = CharacterSize.small * expansionRate;
    let lines = CharacterDrawer.getTextLines(p5, { text, radius: characterSize, scale: 1 }).length;
    if (lines <= 3) return characterSize;

    characterSize = CharacterSize.medium * expansionRate;
    lines = CharacterDrawer.getTextLines(p5, { text, radius: characterSize, scale: 1 }).length;
    if (lines <= 3) return characterSize;

    return CharacterSize.large * expansionRate;
  }

  private static getEyePosition(character: CharacterParams): EyePosition {
    const { position, radius, scale } = character;
    return {
      left: Vector.create(
        position.x - radius * 0.35 * scale,
        position.y - radius * 0.45 * scale,
      ),
      right: Vector.create(
        position.x + radius * 0.35 * scale,
        position.y - radius * 0.45 * scale,
      ),
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

  private static drawBody(character: CharacterParams, p5: P5Types) {
    const { opacity, scale } = character;

    // 影の描画
    const colorShadow = p5.color('#004080');
    colorShadow.setAlpha(5 / 100 * 255);

    p5.push();
    p5.fill(colorShadow)
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
    const eyePosition = CharacterDrawer.getEyePosition(character);
    const { colorEye } = CharacterDrawer.getColor({ character, p5, opacity });
    p5.push();
    p5.fill(colorEye)
      .noStroke()
      .circle(eyePosition.left.x, eyePosition.left.y, character.radius * 0.15 * scale)
      .circle(eyePosition.right.x, eyePosition.right.y, character.radius * 0.15 * scale);
    p5.pop();
  }

  private static drawMessage(character: CharacterParams, p5: P5Types) {
    // textの描画
    const { scale, opacity, radius, message } = character;
    const textLines = CharacterDrawer.getTextLines(p5, { text: message, radius, scale });

    // 目とキャラクター下端との中点。これを基準としてテキストを配置していく。
    const eyePosition = CharacterDrawer.getEyePosition(character);
    const { scaleX, messageTextSize } = CharacterDrawer;
    const basePosition = Vector.create(
      character.position.x,
      eyePosition.left.y + (radius * scaleX) * Math.tan(75 / 180),
    );
    p5.textSize(CharacterDrawer.messageTextSize * scale);

    const textBoxWidth = CharacterDrawer.getTextBoxWidth(radius * scale);
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

    let textBoxBottomY: number;
    // 格納したtextの描画
    if (textLines.length === 1) {
      const { colorText } = CharacterDrawer.getColor({ character, p5, opacity });
      p5.fill(colorText)
        .textAlign('center', 'center')
        .textSize(messageTextSize * scale)
        .text(textLines[0], startPosition.x, startPosition.y);
      textBoxBottomY = startPosition.y + messageTextSize * scale;
    } else {
      for (let i = 0; i < textLines.length; i += 1) {
        p5.fill(0)
          .textAlign('left', 'center')
          .textSize(messageTextSize * scale)
          .text(textLines[i], startPosition.x, startPosition.y + messageTextSize * scale * i);
      }
      textBoxBottomY = startPosition.y + messageTextSize * scale * textLines.length;
    }

    return { textBoxBottomY };
  }

  private static drawSenderName(character: CharacterParams, p5: P5Types, textBoxBottomY: number) {
    const { scale, opacity, position, sender } = character;
    const { colorSender } = CharacterDrawer.getColor({ character, p5, opacity });
    p5.fill(colorSender)
      .textSize(CharacterDrawer.senderNameTextSize * scale)
      .textAlign('center', 'center')
      .text(`@ ${sender}`, position.x, textBoxBottomY + 8);
  }

  // eslint-disable-next-line class-methods-use-this
  draw(character: CharacterParams, p5: P5Types, world: World): CharacterParams {
    // キャラクターの大きさを、画面サイズに合わせて変更
    const radius = CharacterDrawer.getCharacterSize(p5, world.canvas.isMobile, character.message);
    if (radius !== character.radius) character.radius = radius;

    // キャラクターを描画
    CharacterDrawer.drawBody(character, p5);
    const { textBoxBottomY } = CharacterDrawer.drawMessage(character, p5);
    CharacterDrawer.drawSenderName(character, p5, textBoxBottomY);
    return character;
  }
}
