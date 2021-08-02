import { Bodies, Body } from 'matter-js';
import { CharacterDrawer } from 'src/view/matter/actors/character/characterDrawer';
import { ActorParameter } from 'src/view/matter/types/actorParameter';

type Props = {
  position: {x: number, y: number},
  color: string,
  collision: boolean,
  scale: number,
  opacity: number,
  radius: number,
  message: string,
  sender: string,
}

export class CharacterParams extends ActorParameter {
  public color: string;

  public scale: number;

  public opacity: number;

  public readonly message: string;

  public readonly sender: string;

  constructor({ position, color, collision, scale, opacity, radius, message, sender }: Props) {
    const body = Bodies.circle(position.x, position.y, radius, {
      inertia: Infinity,
      frictionAir: 0,
      restitution: 0.3,
    });
    super(body);

    this.color = color;
    this.collision = collision;
    this.scale = scale;
    this.opacity = opacity;
    this._radius = radius;
    this.message = message;
    this.sender = sender;

    Body.scale(this.body, CharacterDrawer.scaleX, CharacterDrawer.scaleY);

    this.body.label = 'character';
  }

  private _radius: number;

  get radius(): number {
    return this._radius;
  }

  set radius(value: number) {
    // 円に戻す
    Body.scale(
      this.body,
      1 / (CharacterDrawer.scaleX * this._radius),
      1 / (CharacterDrawer.scaleY * this._radius),
    );

    // 与えられた半径でスケール
    this._radius = value;
    Body.scale(
      this.body,
      CharacterDrawer.scaleX * value,
      CharacterDrawer.scaleY * value,
    );
  }

  /**
   * 他のキャラクターとの衝突をするかどうかを設定。
   */
  set collision(value: boolean) {
    if (value) {
      this.body.collisionFilter.group = 0;
    } else {
      this.body.collisionFilter.group = -1;
    }
  }
}
