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

  /* キャンバスサイズとウィンドウサイズが同じかどうか調べる */
  checkCanvasSize(): boolean {
    return (this.width !== document.documentElement.clientWidth)
        || (this.height !== document.documentElement.clientHeight);
  }
}
