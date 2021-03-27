export class CanvasParameter {

  constructor(public width: number, public height: number) {
  }

  // tslint:disable-next-line:variable-name
  get center() {
    return {
      x: this.width * 0.5,
      y: this.height * 0.5,
    };
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  /**
   * キャンバスサイズの変更を検知し、変更があったときのみ、{@param onResize}を呼び出す。
   * @param parent キャンバスの親要素　この要素のパラメータに基づいて、変更の検知を行う。
   * @param onResize サイズ変更時に呼び出されるコールバック関数
   */
  checkResize(parent: HTMLDivElement, onResize: (width: number, height: number) => void): boolean {
    const newWidth = parent.clientWidth;
    const newHeight = parent.clientHeight;
    const sizeChanged = (this.width !== newWidth) || (this.height !== newHeight);
    if (sizeChanged) onResize(newWidth, newHeight);
    return sizeChanged;
  }
}
