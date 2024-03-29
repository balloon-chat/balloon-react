import React, { useEffect, useRef } from 'react';
import P5Types from 'p5';
import { MatterWorldFactory } from 'src/view/matter/worlds/matterWorldFactory';
import { useMessageState } from 'src/data/redux/message/selector';
import styled from 'styled-components';
import { Render } from 'matter-js';
import { MatterListAdapter } from 'src/view/matter/lib/matterListAdapter';
import { CameraController } from 'src/components/topic/camera/CameraController';
import { useCamera } from 'src/components/p5/useCamera';

// Matterのレンダラーで表示する（P5だと回転などが考慮されないことがある。）
const debug = false;

export const Canvas: React.FC = () => {
  const { messages } = useMessageState();
  const renderRef = useRef<HTMLDivElement>(null);
  const listAdapterRef = useRef<MatterListAdapter>();
  const worldRef = useRef(MatterWorldFactory.create(
    document.documentElement.clientWidth,
    document.documentElement.clientHeight,
  ));

  const { cameraUpHandler, cameraDownHandler } = useCamera(renderRef, worldRef);

  useEffect(() => {
    const listAdapter = listAdapterRef.current;
    if (!messages || !listAdapter) return;

    listAdapter.submit(messages);
    console.log('RECEIVED MESSAGES:', messages);
  }, [messages]);

  useEffect(() => {
    const parent = renderRef.current;
    if (!parent) return undefined;

    const p5 = new P5Types((p: P5Types) => {
      // eslint-disable-next-line no-param-reassign
      p.setup = () => setup(p, parent);
      // eslint-disable-next-line no-param-reassign
      p.draw = () => draw(p);
    });

    const world = worldRef.current;
    world.setMouseEventHandler(parent);
    world.start(p5);

    const listAdapter = new MatterListAdapter(world);
    listAdapterRef.current = listAdapter;

    if (debug) {
      const renderer = Render.create({
        element: parent,
        engine: world.engine,
        options: {
          width: parent.clientWidth,
          height: parent.clientHeight,
          wireframes: false,
        },
      });
      Render.run(renderer);
    }

    return () => {
      p5.remove();
      world.destroy();
      listAdapter.submit([]);
    };
  }, [renderRef]);

  const setup = (p5: P5Types, parent: HTMLElement) => {
    const renderer = p5.createCanvas(parent.clientWidth, parent.clientHeight);
    renderer.parent(parent);
  };

  const draw = (p5: P5Types) => {
    // キャンバスサイズの更新
    const world = worldRef.current;
    const renderer = renderRef.current;
    if (!renderer) return;

    world.canvas.checkResize(renderer, (width, height) => {
      p5.resizeCanvas(width, height, true);
      world.resizeCanvas(width, height - 83);
    });

    // 背面を白で塗りつぶす
    p5.background(255);

    // キャラクターの描画
    if (renderer.children.length === 0) return;
    world.update(p5);
  };

  return (
    <>
      <Container id="renderer" ref={renderRef} />
      <CameraController cameraUp={cameraUpHandler} cameraDown={cameraDownHandler} />
    </>
  );
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
