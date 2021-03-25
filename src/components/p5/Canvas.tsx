import React, { useEffect, useRef } from 'react';
import P5Types from 'p5';
import { MatterControllerFactory } from 'src/view/matter/controllers/matterControllerFactory';
import { drawVertices } from 'src/view/matter/util/drawVertices';
import { useMessageState } from 'src/data/redux/message/selector';
import styled from 'styled-components';

const controller = MatterControllerFactory.create(
    document.documentElement.clientWidth,
    document.documentElement.clientHeight,
);

// tslint:disable-next-line:variable-name
export const Canvas: React.FC = () => {
  const { messages } = useMessageState();
  const renderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messages) return;
    controller.adapter.submit(messages);
  },        [messages]);

  useEffect(() => {
    if (!renderRef.current) return;
    const parent = renderRef.current;

    const p5 = new P5Types((p: P5Types) => {
      p.setup = () => setup(p, parent);
      p.draw = () => draw(p);
    });

    return () => {
      p5.remove();
    };
  },        [renderRef]);

  const setup = (p5: P5Types, canvasParentRef: Element) => {
    p5.createCanvas(
        canvasParentRef.clientWidth,
        canvasParentRef.clientHeight,
    ).parent(canvasParentRef);

    // 壁の描画
    controller.walls.forEach(object => {
      p5.fill(p5.color('white'));
      drawVertices(p5, object.vertices);
    });

    controller.run();
  };

  const draw = (p5: P5Types) => {
    // キャンバスのサイズ変更 現在のキャンバスサイズとウインドウのサイズが異なれば変更する
    if (controller.canvas.checkCanvasSize()) {
      console.log(`canvas is resized\nwidth: ${document.documentElement.clientWidth} px\nheight: ${document.documentElement.clientHeight} px`);
      p5.resizeCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);
      controller.canvas.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
    }

    // 背面を白で塗りつぶす
    p5.background(255);

    p5.fill(p5.color('blue'));
    drawVertices(p5, controller.addButton.vertices);
    p5.fill(p5.color('green'));
    drawVertices(p5, controller.removeAllButton.vertices);

    // キャラクターの描画
    const characters = Array.from(controller.characterController.characters.values());
    for (const character of characters) {
      character.draw(p5);
    }
  };

  return (<Container ref={renderRef}/>);
};

// tslint:disable-next-line:variable-name
const Container = styled.div`
  box-sizing: border-box;
  flex: 1 1 auto;
  position: relative;
  overflow: hidden;
`;
