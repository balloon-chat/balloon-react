import { Button } from 'src/view/matter/actors/button/button';

export enum buttonType {
    add = 'addButton',
    removeAll = 'removeAllButton',
    shakeAll = 'shakeAllButton',
}

export class ButtonFactory {
  static create(x: number, y: number, type: buttonType, color: string): Button {
    return new Button(x, y, type, color);
  }
}
