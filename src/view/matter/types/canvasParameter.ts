import { mediaQuery } from 'src/components/constants/mediaQuery';

export class CanvasParameter {
  constructor(public width: number, public height: number) {}

  get center() {
    return {
      x: this.width * 0.5,
      y: this.height * 0.5,
    };
  }

  get isMobile() :boolean {
    return this.width <= mediaQuery.mobile.landscape;
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  /**
   * キャンバスサイズの変更を検知し、変更があったときのみ、{@param onResize}を呼び出す。
   * @param parent キャンバスの親要素 この要素のパラメータに基づいて、変更の検知を行う。
   * @param onResize サイズ変更時に呼び出されるコールバック関数
   */
  checkResize(
    parent: HTMLDivElement,
    onResize: (width: number, height: number) => void,
  ): boolean {
    const newWidth = parent.clientWidth;
    const newHeight = parent.clientHeight;
    const sizeChanged = this.width !== newWidth || this.height !== newHeight;
    if (sizeChanged) {
      onResize(newWidth, newHeight);
      this.width = newWidth;
      this.height = newHeight;
      console.info('detect resize:', { width: this.width, height: this.height });
    }
    return sizeChanged;
  }
}
