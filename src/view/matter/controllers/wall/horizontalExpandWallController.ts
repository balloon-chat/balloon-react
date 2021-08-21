/* eslint-disable class-methods-use-this,no-param-reassign */
import { Controller } from 'src/view/matter/types/controller';
import { WallParams } from 'src/view/matter/actors/wall/wallParams';
import { World } from 'src/view/matter/types/world';
import P5Types from 'p5';
import { Body } from 'matter-js';

/**
 * 画面の幅とちょうど同じになるように、壁の幅を変更する。
 */
export class HorizontalExpandWallController extends Controller<WallParams> {
  private prevCanvasWidth: number = 0;

  onStart(_p5: P5Types, world: World, actor: WallParams): WallParams {
    this.prevCanvasWidth = world.canvas.width;
    return actor;
  }

  onUpdate(_p5: P5Types, world: World, actor: WallParams): WallParams {
    const canvasWidth = world.canvas.width;

    // キャンバスサイズの大きさの変化が小さければ何もしない
    if (Math.abs(canvasWidth - this.prevCanvasWidth) < 10) return actor;

    // 壁の幅を画面幅いっぱいにする
    Body.translate(actor.body, { x: (canvasWidth - this.prevCanvasWidth) / 2, y: 0 });
    Body.scale(actor.body, canvasWidth / this.prevCanvasWidth, 1);

    actor.width = canvasWidth;
    this.prevCanvasWidth = canvasWidth;

    return actor;
  }
}
