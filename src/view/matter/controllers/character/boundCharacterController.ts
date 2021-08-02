/* eslint-disable no-param-reassign */
import { World } from 'src/view/matter/types/world';
import { Controller } from 'src/view/matter/types/controller';
import P5Types from 'p5';
import { Vector } from 'matter-js';
import { CharacterParams } from 'src/view/matter/actors/character/characterParams';

export class BoundCharacterController extends Controller<CharacterParams> {
  public static readonly maxSpeed = 10;

  private static moveSomeWhere(actor: CharacterParams): CharacterParams {
    const sign = {
      x: Math.random() < 0.5 ? -1 : 1,
      y: Math.random() < 0.5 ? -1 : 1,
    };

    // ランダムな方向へ速度をもたせる
    let velocity: Vector = Vector.normalise(Vector.create(
      sign.x * Math.random(),
      sign.y * Math.random(),
    ));

    // 最大速度を超えないように調整
    velocity = Vector.mult(
      velocity,
      BoundCharacterController.maxSpeed,
    );

    actor.velocity = velocity;
    return actor;
  }

  /**
   * 速度に応じて減衰をかけ、キャラクターの速度が一定以上に達しないように制御する。
   */
  private static controlSpeed(actor: CharacterParams): CharacterParams {
    const { speed, velocity } = actor.body;
    const { maxSpeed } = BoundCharacterController;

    // 最大速度以下に抑える
    if (speed > maxSpeed) {
      actor.velocity = Vector.mult(Vector.normalise(velocity), maxSpeed);
      return actor;
    }

    // 減衰させる
    // 最大速度の20％になった時点で、減衰率を上げ画面外に出ていかないようにする。
    let decelerationRate;
    if (speed < maxSpeed * 0.2) {
      decelerationRate = 0.15;
    } else {
      decelerationRate = 0.03;
    }

    actor.velocity = Vector.mult(velocity, 1.0 - decelerationRate);
    return actor;
  }

  // eslint-disable-next-line class-methods-use-this
  onStart(_: P5Types, __: World, actor: CharacterParams): CharacterParams {
    actor = BoundCharacterController.moveSomeWhere(actor);
    return actor;
  }

  // eslint-disable-next-line class-methods-use-this
  onUpdate(_: P5Types, __: World, actor: CharacterParams): CharacterParams {
    actor = BoundCharacterController.controlSpeed(actor);
    return actor;
  }
}
