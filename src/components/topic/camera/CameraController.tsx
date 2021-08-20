import React, { Children, FormEvent, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import VideoCam from 'src/components/svgs/videocam.svg';
import { mediaQuery } from 'src/components/constants/mediaQuery';

type Props = {
  cameraUp: () => void
  cameraDown: () => void,
}

export const CameraController = ({ cameraUp, cameraDown }: Props) => (
  <Container>
    <CameraButton action={cameraUp}><UpArrow /></CameraButton>
    <CameraIconContainer onContextMenu={(e) => e.preventDefault()}>
      <VideoCam />
    </CameraIconContainer>
    <CameraButton action={cameraDown}><BottomArrow /></CameraButton>
  </Container>
);

export const CameraButton: React.FC<{action: () => void}> = ({ action, children }) => {
  const [isHolding, setIsHolding] = useState<boolean>();

  useEffect(() => {
    if (!isHolding) return undefined;

    const id = setInterval(action, 1 / 64 * 1000);
    return () => { clearInterval(id); };
  }, [isHolding]);

  const handleStartPress = useCallback((e: FormEvent) => {
    e.preventDefault();
    setIsHolding(true);
  }, []);

  const handleEndPress = useCallback((e: FormEvent) => {
    e.preventDefault();
    setIsHolding(false);
  }, []);

  return Children.only(
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <ArrowContainer
      onMouseDown={handleStartPress}
      onMouseUp={handleEndPress}
      onTouchStart={handleStartPress}
      onTouchEnd={handleEndPress}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </ArrowContainer>,
  );
};

const Container = styled.div`
  align-items: center;
  border-radius: 5px;
  background-color: white;
  box-shadow: 20px 20px 60px rgba(0,0,0,.1);
  display: flex;
  flex-direction: column;
  margin: 16px;
  top: 0;
  right: 0;
  position: absolute;
  padding: 8px;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    margin: 32px;
  }
`;

const CameraIconContainer = styled.div`
  border-radius: 100%;
  border: 2px solid rgba(0, 0, 0, .1);
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  & > svg {
    fill: #5b87fa;
  }
`;

const ArrowContainer = styled.div`
  cursor: pointer;
  padding: 8px 0;
  
  :active {
    & > div {
      border-bottom-color: #5b87fa;
    }
  }
`;

const Arrow = styled.div`
  box-sizing: border-box;
  border-right: 20px solid transparent;
  border-bottom: 16px solid rgba(0, 0, 0, .5);
  border-left: 20px solid transparent;
  cursor: pointer;
  user-select: none;
`;

const UpArrow = styled(Arrow)`
`;

const BottomArrow = styled(Arrow)`
  transform: rotateX(180deg);
`;
