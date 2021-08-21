import { useMessageState } from 'src/data/redux/message/selector';
import { MutableRefObject, RefObject, useCallback, useEffect } from 'react';
import { World } from 'src/view/matter/types/world';

export const useCamera = (renderRef: RefObject<HTMLElement>, worldRef: MutableRefObject<World>) => {
  const { messages } = useMessageState();

  useEffect(() => {
    // メッセージが一件もないときは、カメラの動きがわからないのでキャンセル
    if (!messages || messages.length < 1) return undefined;

    const renderer = renderRef.current;
    if (!renderer) return undefined;

    const world = worldRef.current;

    const handler = (e: WheelEvent) => {
      e.preventDefault();
      world.camera.move(e.deltaX, e.deltaY);
    };
    renderer.addEventListener('wheel', handler, { passive: false });

    return () => {
      renderer.removeEventListener('wheel', handler);
    };
  }, [!messages || messages.length < 1]);

  const cameraUpHandler = useCallback(() => {
    if (!messages || messages.length < 1) return;

    const world = worldRef.current;
    world.camera.move(0, -10);
  }, [!messages || messages.length < 1]);

  const cameraDownHandler = useCallback(() => {
    if (!messages || messages.length < 1) return;

    const world = worldRef.current;
    world.camera.move(0, 10);
  }, [!messages || messages.length < 1]);

  return { cameraUpHandler, cameraDownHandler };
};
