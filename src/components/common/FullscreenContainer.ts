import styled from 'styled-components';
import { ZIndex } from 'src/components/constants/z_index';
import { fadeinAnimation } from 'src/components/common/Animations';

export const FullscreenContainer = styled.div<{animate?: boolean, isVisible: boolean, transparent?: boolean}>`
  background-color: ${({ transparent }) => (transparent ? 'transparent' : 'rgba(0, 0, 0, .6)')};
  
  animation: ${fadeinAnimation} ${({ animate, transparent }) => (animate && !transparent ? 200 : 0)}ms;
  transition: all ${({ animate, transparent }) => (animate && !transparent ? 200 : 0)}ms;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${ZIndex.dialog};
`;
