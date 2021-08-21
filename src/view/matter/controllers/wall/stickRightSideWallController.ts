import { Controller } from 'src/view/matter/types/core/controller';
import { WallParams } from 'src/view/matter/actors/wall/wallParams';
import P5Types from 'p5';
import { World } from 'src/view/matter/types/core/world';
import { Body } from 'matter-js';

/**
 * 画面の右横にくっつくように、壁を移動させる。
 */
export class StickRightSideWallController extends Controller<WallParams> {
  private prevCanvasWidth: number = 0;

  onStart(_p5: P5Types, world: World, actor: WallParams): WallParams {
    Body.setPosition(actor.body, {
      x: world.canvas.width + WallParams.WALL_THICK / 2,
      y: actor.position.y,
    });
    this.prevCanvasWidth = world.canvas.width;
    return actor;
  }

  onUpdate(_p5: P5Types, world: World, actor: WallParams): WallParams {
    const canvasWidth = world.canvas.width;

    // キャンバスサイズの大きさの変化が小さければ何もしない
    if (Math.abs(canvasWidth - this.prevCanvasWidth) < 10) return actor;

    // 右の壁の位置を画面の右端に移動
    const wallThick = WallParams.WALL_THICK;
    Body.setPosition(actor.body, { x: canvasWidth + wallThick / 2, y: actor.position.y });

    this.prevCanvasWidth = canvasWidth;

    return actor;
  }
}
