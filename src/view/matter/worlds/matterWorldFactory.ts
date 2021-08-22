import { Engine } from 'matter-js';
import { CanvasParameter } from 'src/view/matter/types/util/canvasParameter';
import { MatterWorld } from 'src/view/matter/worlds/matterWorld';

export class MatterWorldFactory {
  private static _instance: MatterWorld | null;

  static create(windowWidth: number, windowHeight: number): MatterWorld {
    if (this._instance) return this._instance;

    const engine = Engine.create();
    const canvas = new CanvasParameter(windowWidth, windowHeight);

    this._instance = new MatterWorld(engine, canvas);

    return this._instance;
  }
}
