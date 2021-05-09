import React, { useEffect, useRef } from 'react';
import P5Types from 'p5';
import { MatterControllerFactory } from 'src/view/matter/controllers/matterControllerFactory';
import { useMessageState } from 'src/data/redux/message/selector';
import styled from 'styled-components';

export const Canvas: React.FC = () => {
  const { messages } = useMessageState();
  const renderRef = useRef<HTMLDivElement>(null);

  const controller = MatterControllerFactory.create(
    document.documentElement.clientWidth,
    document.documentElement.clientHeight,
  );

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
      // eslint-disable-next-line no-param-reassign
      p.mouseClicked = () => mousePressed(p);
    });

    controller.p5 = p5;

    return () => {
      p5.remove();
      controller.p5 = null;
    };
  }, [renderRef]);

  const setup = (p5: P5Types, canvasParentRef: HTMLElement) => {
    const renderer = p5.createCanvas(
      canvasParentRef.clientWidth,
      canvasParentRef.clientHeight,
    );
    renderer.parent(canvasParentRef);
    controller.setMouseEventHandler(canvasParentRef);
    controller.run();
  };

  const draw = (p5: P5Types) => {
    // キャンバスサイズの更新
    if (renderRef.current) {
      controller.canvas.checkResize(renderRef.current, (width, height) => {
        p5.resizeCanvas(width, height, true);
        controller.canvas.setSize(width, height);
      });
    }

    // 背面を白で塗りつぶす
    p5.background(255);

    controller.buttons.forEach((button) => {
      button.draw(p5);
    });

    // キャラクターの描画
    const characters = Array.from(
      controller.characterController.characters.values(),
    );
    characters.forEach((character) => {
      character.draw(p5);
    });
  };

  const mousePressed = (p5: P5Types) => {
    const characters = Array.from(
      controller.characterController.characters.values(),
    );
    characters.forEach((character) => {
      character.onMousePressed(controller, p5.mouseX, p5.mouseY);
    });

    controller.buttons.forEach((button) => {
      button.mousePressed(controller, p5.mouseX, p5.mouseY);
    });
  };

  return <Container ref={renderRef} />;
};

const Container = styled.div`
  box-sizing: border-box;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: hidden;
`;
