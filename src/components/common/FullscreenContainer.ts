import styled from 'styled-components';
import { ZIndex } from 'src/components/constants/z_index';

export const FullscreenContainer = styled.div<{isVisible: boolean, transparent?: boolean}>`
  transition: all 0.4s ease-in-out;
  background-color: ${(props) => (props.transparent ? 'transparent' : 'rgba(0, 0, 0, .6)')};
  visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')};
  
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${ZIndex.dialog};
`;
