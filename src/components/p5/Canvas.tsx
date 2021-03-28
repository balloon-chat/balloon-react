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

export const Canvas: React.FC = () => {
  const { messages } = useMessageState();
  const renderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messages) return;
    controller.adapter.submit(messages);
  }, [messages]);

  useEffect(() => {
    if (!renderRef.current) return undefined;
    const parent = renderRef.current;

    const p5 = new P5Types((p: P5Types) => {
      // eslint-disable-next-line no-param-reassign
      p.setup = () => setup(p, parent);
      // eslint-disable-next-line no-param-reassign
      p.draw = () => draw(p);
    });

    return () => {
      p5.remove();
    };
  }, [renderRef]);

  const setup = (p5: P5Types, canvasParentRef: Element) => {
    const renderer = p5.createCanvas(
      canvasParentRef.clientWidth,
      canvasParentRef.clientHeight,
    );
    renderer.parent(canvasParentRef);

    // 壁の描画
    controller.walls.forEach((object) => {
      p5.fill(p5.color('white'));
      drawVertices(p5, object.vertices);
    });

    controller.run();
  };

  const draw = (p5: P5Types) => {
    // キャンバスサイズの更新
    if (renderRef.current) {
      controller.canvas.checkResize(renderRef.current, (width, height) => {
        p5.resizeCanvas(width, height);
        controller.canvas.setSize(width, height);
      });
    }

    // 背面を白で塗りつぶす
    p5.background(255);

    p5.fill(p5.color('blue'));
    drawVertices(p5, controller.addButton.vertices);
    p5.fill(p5.color('green'));
    drawVertices(p5, controller.removeAllButton.vertices);

    // キャラクターの描画
    const characters = Array.from(
      controller.characterController.characters.values(),
    );
    characters.forEach((character) => character.draw(p5));
  };

  return <Container ref={renderRef} />;
};

const Container = styled.div`
  box-sizing: border-box;
  flex: 1 1 auto;
  position: relative;
  overflow: hidden;
`;
