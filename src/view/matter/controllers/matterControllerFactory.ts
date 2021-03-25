import Matter, { Bodies } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/models/canvasParameter';
import { MatterController } from 'src/view/matter/controllers/matterController';
import { CharacterController } from 'src/view/matter/controllers/characterController';

export class MatterControllerFactory {
  static create(windowWidth: number, windowHeight: number): MatterController {
    const engine = Matter.Engine.create();
    const canvas = new CanvasParameter(windowWidth, windowHeight);

    // キャラクターを管理するクラス
    const characterController = new CharacterController();

    // Bodyを生成
    const walls = createWalls(canvas, 0);
    const addButton = Matter.Bodies.rectangle(100, 50, 200, 100, { isStatic: true, label: 'addButton' });
    const removeAllButton = Matter.Bodies.rectangle(100, 150, 200, 100, { isStatic: true, label: 'removeAllButton' });

    return new MatterController(
        engine,
        walls,
        addButton,
        removeAllButton,
        characterController,
        canvas,
    );
  }
}

/**
 * 画面端四方に壁を生成する
 * @param {CanvasParameter} canvas 壁を描画するキャンバスのパラメーター
 * @param {number} restitution 反発係数
 * @returns {Matter.Body[]} 壁オブジェクト４つが入った配列
 */
const createWalls = (canvas: CanvasParameter, restitution: number = 0): Matter.Body[] => {
  const options: Matter.IBodyDefinition = {
    isStatic: true,
    restitution,
    render: {
      fillStyle: 'red',
    },
  };

  return [
    Bodies.rectangle(canvas.center.x, canvas.height, canvas.width, 100, options), // wallUnder
    Bodies.rectangle(canvas.center.x, 0, canvas.width, 100, options), // wallTop
    Bodies.rectangle(0, canvas.center.y, 100, canvas.height, options), // wallLeft
    Bodies.rectangle(canvas.width, canvas.center.y, 100, canvas.height, options), // wallRight
  ];
};
