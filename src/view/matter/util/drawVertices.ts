import P5Types from 'p5';
import { Vector } from 'matter-js';

export const drawVertices = (p: P5Types, vertices: Vector[]) => {
  p.beginShape();
  for (let i = 0; i < vertices.length; i += 1) {
    p.vertex(vertices[i].x, vertices[i].y);
  }
  p.endShape(p.CLOSE);
};
