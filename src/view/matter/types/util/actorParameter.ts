import Matter, { Body, Common, Vector } from 'matter-js';

/**
 * {@link Actor}の持つ属性。
 * {@link Controller}はこの属性を変化させることにより、振る舞いを変化させる。
 */
export class ActorParameter {
  protected constructor(public readonly body: Body) {
    this.body.id = Common.nextId();
  }

  get position() {
    return this.body.position;
  }

  set position(position: Vector) {
    Matter.Body.setPosition(this.body, position);
  }

  get velocity() {
    return this.body.velocity;
  }

  set velocity(value: Vector) {
    Matter.Body.setVelocity(this.body, value);
  }
}
